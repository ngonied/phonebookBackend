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
  'req-body', (req) => {
    if (req.method ==='POST'){
      return JSON.stringify(req.body)
    }
    return ''
  })

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body'
  )
)


app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date().toLocaleString('de-DE', { hour: '2-digit',   hour12: false, timeZone: 'Europe/Athens' })
  Person.find({}).then(people => {
    response.send(`<p>Phonebook has info for for ${people.length} people </p></br><p>${Date()}</p>`)
  })



})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })

})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }

  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request,response, next) => {
  const number = request.body
  Person.findByIdAndUpdate(request.params.id,
    number,
    { new: true, runValidators: true, context: 'query' } )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request,response, next) => {
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
    savedPerson => {
      response.json(savedPerson)
    }
  )
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(res => {
      response.status(204).end()
    }).catch(error => next(error))
})




const unknownEndpoint = (request, response) => {
  response.status(404).send({ error:'unkown endpoint' })
}
app.use(unknownEndpoint)




const errorHandler =(error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({ error:'malformatted id' })
  }else if(error.name = 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)





const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

