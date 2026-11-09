
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// Serve React production files
app.use(express.static('dist'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-1234567'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  }
]

// GET all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// GET phonebook information
app.get('/info', (request, response) => {
  response.send(`
    Phonebook has info for ${persons.length} people
    <br><br>
    ${new Date()}
  `)
})

// GET one person
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// POST a new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number || !body.name.trim() || !body.number.trim()) {
    return response.status(400).json({
      error: 'Name or number is missing'
    })
  }

  const existingPerson = persons.find(
    person => person.name.toLowerCase() === body.name.trim().toLowerCase()
  )

  if (existingPerson) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name.trim(),
    number: body.number.trim()
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})

// DELETE a person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
