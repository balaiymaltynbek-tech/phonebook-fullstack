
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import Person from './models/person.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Get all persons
app.get('/api/persons', async (request, response) => {
  try {
    const persons = await Person.find({})
    response.json(persons)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

// Add a person
app.post('/api/persons', async (request, response) => {
  try {
    const person = new Person({
      name: request.body.name,
      number: request.body.number
    })

    const savedPerson = await person.save()
    response.status(201).json(savedPerson)
  } catch (error) {
    response.status(400).json({
      error: error.message
    })
  }
})

// Delete a person
app.delete('/api/persons/:id', async (request, response) => {
  try {
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
  })
