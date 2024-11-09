const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
const Person = require('./models/contacts')


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



app.get('/', (request, response)=>{
	response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response)=>{
  const date = new Date().toLocaleString('de-DE', {hour: '2-digit',   hour12: false, timeZone: 'Europe/Athens' })
  Person.find({}).then(people=>{
    response.send(`<p>Phonebook has info for for ${people.length} people </p></br><p>${Date()}</p>`) 
  })
  // Person.countDocuments({}, function(err, count){
  //   if (err){
  //     console.log(err)
  //   }else{
  //     
  //   }
  // })
  
  
})

app.get('/api/persons', (request, response)=>{
    Person.find({}).then(people=>{
    response.json(people)
  })
	
})

app.get('/api/persons/:id', (request, response, next)=>{
  // const contactExists = Person.findOne({name: request.params.name})
  // if (contactExists){
  //   console.log("exists", contactExists)
  // }
  Person.findById(request.params.id).then(person=>{
    if(person){
      response.json(person)  
    }else{
      response.status(404).end()
    }
    
  }).catch(error =>next(error))
})

app.put('/api/persons/:id', (request,response, next)=>{
  const number = request.body
  Person.findByIdAndUpdate(request.params.id,number, {new: true} )
  .then(updatedPerson=>{
    response.json(updatedPerson)
  })
  .catch(error =>next(error))
})

app.post('/api/persons', (request,response)=>{
    const body = request.body

    if (body.name === undefined){
      return response.status(400).json({
        error: 'Name is missing'
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(
      savedPerson =>{
          response.json(savedPerson)
      }
    )    
})

app.delete('/api/persons/:id', (request, response, next)=>{
  Person.findByIdAndDelete(request.params.id)
  .then(res =>{
    response.status(204).end()
  }).catch(error=>next(error))
})

const unknownEndpoint = (request, response)=>{
  response.status(404).send({error:'unkown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler =(error, request, response, next)=>{
  console.error(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({ error:'malformatted id'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
	console.log(`Server running on port ${PORT}`)
})


//   const contactExists = persons.some((x)=>x.name === person.name)
  //  // const numberExists = person.some((x)=>x.number === person.number) 
      
  //     if (!contactExists && person.number !== ''){
  //             person.id = String(Math.floor(Math.random()*1000))
  //             persons = persons.concat(person)
  //             response.json(person)
           
  //       }else if(contactExists) {
  //         console.log("Contact already exists")
  //         return response.status(400).json({
  //           error:'name must be unique'
  //         })
  //       }else if(!person.number){
  //         console.log("Missing number")
  //         return response.status(400).json({
  //           error:'number missing'
  //         })
  //       }

  // console.log(error)
    // response.status(400).send({error: 'malformed id'})
  // const id = request.params.id
  // const person = persons.find(person =>person.id === id)
  // if (person){
  //   response.json(person)
  // }else{
  //   response.status(404).end()
  // }


  // const id = request.params.id
  // persons = persons.filter(person=>person.id !== id)

  // response.status(204).end()