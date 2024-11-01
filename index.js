const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')



app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

morgan.token(
   "req-body", (req)=>{
    if (req.method ==="POST"){
    return JSON.stringify(req.body)
   }
   return "";
})

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
)


let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const numberOfPeople = persons.length
//console.log(numberOfPeople)

app.get('/', (request, response)=>{
	response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response)=>{
  const date = new Date().toLocaleString('de-DE', {hour: '2-digit',   hour12: false, timeZone: 'Europe/Athens' })
  response.send(`<p>Phonebook has info for for ${numberOfPeople} people </p></br><p>${Date()}</p>`)
})

app.get('/api/persons', (request, response)=>{
	response.json(persons)
})

app.get('/api/persons/:id', (request, response)=>{
  const id = request.params.id
  const person = persons.find(person =>person.id === id)
  if (person){
    response.json(person)
  }else{
    response.status(404).end()
  }
  
})

app.post('/api/persons', (request,response)=>{
    const person = request.body

    const contactExists = persons.some((x)=>x.name === person.name)
   // const numberExists = person.some((x)=>x.number === person.number) 
      
      if (!contactExists && person.number !== ''){
              person.id = String(Math.floor(Math.random()*1000))
              persons = persons.concat(person)
              response.json(person)
           
        }else if(contactExists) {
          console.log("Contact already exists")
          return response.status(400).json({
            error:'name must be unique'
          })
        }else if(!person.number){
          console.log("Missing number")
          return response.status(400).json({
            error:'number missing'
          })
        }
    
})

app.delete('/api/persons/:id', (request, response)=>{
  const id = request.params.id
  persons = persons.filter(person=>person.id !== id)

  response.status(204).end()
})



const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
	console.log(`Server running on port ${PORT}`)
})
