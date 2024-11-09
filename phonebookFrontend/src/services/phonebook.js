import axios from 'axios'
const baseUrl = '/api/persons'



const getAll = ()=>{
    return axios.get(baseUrl)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
  }

  const deletePerson = (id, newDetails)=>{
    console.log(`About to delete ${id} contact`)
    const url = `${baseUrl}/${id}`
    // const note = persons.find(n => n.id === id)
    if (window.confirm("Do you really need to delete this contact?")) {
      return axios.delete(url, newDetails)
      }
  }

const updateContact = (id, number)=>{
  return axios.put(`${baseUrl}/${id}`, number)
}
export default {getAll, create, deletePerson, updateContact}