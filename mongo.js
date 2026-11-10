
import mongoose from 'mongoose'
import 'dotenv/config'

const password = process.argv[2]

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (!password) {
  console.log('Please provide the password')
  process.exit(1)
}

mongoose.connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      return Person.find({}).then(persons => {
        console.log('Phonebook:')

        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
      })
    }

    if (!process.argv[4]) {
      throw new Error('Please provide both name and number')
    }

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4]
    })

    return person.save().then(() => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
    })
  })
  .then(() => mongoose.connection.close())
  .catch(error => {
    console.error('Error:', error.message)
    mongoose.connection.close()
    process.exitCode = 1
  })
