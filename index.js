const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (request, response) => request.method === 'POST' ? JSON.stringify(request.body) : ' ')

app.use(morgan((tokens, request, response) => [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-lenth'), '-',
    tokens['response-time'](request, response), 'ms',
    tokens.body(request, response),
].join(' ')))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)


let persons = [
    {
    id: 1,
    name: "Arto Hellas",
    number: "52-40-123456"
    },
    {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
    },
    {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
    },
    {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
    }
]

const generateId = () => Math.floor(Math.random() * 1000000 + 1)

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const responseText =
     `<p>Phonebook has info for ${persons.length} people</p>
   <p> ${new Date()}</p>
    `
response.send(responseText)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    const person = persons.find(person => id === person.id)

if(person) {
 response.json(person)   
}else {
    response.status(404).end()
}

})

app.post('/api/persons', (request, response) => {
    const id = generateId()

    if(!request.body.number){
        return response.status(400).json({
            error: 'number is missing',
        })
    }

    const foundPerson = persons.find(person => person.name === request.body.name)

    if (foundPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {id, name: request.body.name, number: request.body.number}

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
  })

app.use(unknownEndpoint)

  
const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server started on part ${PORT}`)
})