import { useState, useEffect } from 'react'
import { DisplayContacts } from './components/display'
import { AddUser } from './components/addcontactform'
import { Search } from './components/search'
import {Notification} from './components/notification'
import phonebookService from './services/phonebook'

import './index.css'



const App = () => {
  
 
  
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  const [notificationMessage, setNotificationMessage]= useState([])

  useEffect(()=>{
    phonebookService.getAll().then(res =>{
    setPersons(res.data)
    
    })
    
  }, [])
  
  
  const handleNumberChange = (event)=>{
     setNewNumber(event.target.value)
  }

  const handleNameChange =(event)=>{
    
    setNewName(event.target.value)
  }

  const handleFilterChange=(event)=>{
   setSearchFilter(new RegExp(event.target.value, 'ig'))
    //  setSearchString(()=>event.target.value)
     //setFilteredContacts(()=>persons.filter((person)=>person.name?.toLowerCase().includes(searchString.toLowerCase())))   
     }

     const personObject = {
      name: newName, number: newNumber
    }
  
//setFilteredContacts()
const personsToShow = searchFilter.length === 0 ? persons
: persons.filter(person => person.name.search(searchFilter) >= 0)
//console.log(filteredContacts)
  
  
 
  const addNewName = (event)=>{
      event.preventDefault()
      //check if new contact already exists, reset if true proceed if false
      //console.log(persons)
      const contactExists = persons.some((person)=>person.name === newName)
      
      
      if (contactExists && newNumber !== ''){
           const contactToUpdate = persons.find((contact)=>{
           return contact.name === newName
        })
        
        
        const id = contactToUpdate.id
        
        if(window.confirm(`contact ${personObject.name} will be updated`)){
          phonebookService.updateContact(id, personObject)
        .then((res)=>{
            setPersons(persons.map(p => p.id !== contactToUpdate.id ? p : res.data))
          })

        }
        setNewName('')
        setNewNumber('')

        return
        
      }else if(contactExists){
        alert(`${newName} is already added to phonebook`)
        setNewName('')
        setNewNumber('')
        
        return
      }
      //end of check
      
     
      //create new contact
      phonebookService.create(personObject)
      .then((res)=>{
          //console.log(res)
          setPersons(persons.concat(res))
          setNotificationMessage({'type': 'notification',
                            'content': `${res.name} has been created`
          })
          
        })
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setNotificationMessage(null)
      }, 5000)
       //console.log(persons)
      
   }


  const delFunc =(id)=>{
    phonebookService.deletePerson(id)
    .then(deletedContact => {
      setPersons(persons.filter(p => p.id !== id))
      setNotificationMessage(
        {
          'type':'notification',
          'content':`${deletedContact.name} has been deleted`
        }
      )
    })
    .catch(error => {
      setNotificationMessage({
        'type': 'error',
        'content': `Note '${deletedContact}' was already removed from server`
      })
    }
  )
  setTimeout(() => {
    setNotificationMessage(null)
}, 5000)
  }
   





  return (
    <div>
            <h2>Phonebook</h2>
            <Notification  message={notificationMessage}/>
            <br/>
            <br/>
            
            <Search  handleFilterChange = {handleFilterChange}/>
            
            <br/>
            <br/>
            
            <h2>Add User</h2>
            
            <AddUser addNewName = {addNewName} newName = {newName} handleNameChange={handleNameChange} handleNumberChange ={handleNumberChange} newNumber={newNumber}/>
            
            
            
            <h2>Numbers</h2>
            <ul>{personsToShow.map((person, index)=>{return <DisplayContacts key={index}  person={person} delFunction={()=>delFunc(person.id)}/> })}</ul>
               
    </div>
  )
}

export default App