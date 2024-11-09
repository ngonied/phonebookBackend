import deleteContact from '../services/phonebook'

export const DisplayContacts = ({ person, delFunction}) => {

 

  return (
    <div><li>{person.name} {person.number}  <button onClick={delFunction}>Delete</button></li></div>)
}

