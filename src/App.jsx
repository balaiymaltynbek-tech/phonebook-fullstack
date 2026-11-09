
import { useState, useEffect } from 'react'
import personService from './person'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.log('Error loading persons:', error)
      })
  }, [])

  // Add a new person
  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(prevPersons => prevPersons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setErrorMessage('')
      })
      .catch(error => {
        const message = error.response?.data?.error || 'Something went wrong'

        setErrorMessage(message)
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      })
  }

  // Delete a person
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(prevPersons =>
            prevPersons.filter(person => String(person.id) !== String(id))
          )
        })
        .catch(error => {
          console.log('Error deleting person:', error)
        })
    }
  }

  // Handle name input
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  // Handle number input
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      {errorMessage && (
        <div style={{
          color: 'red',
          background: '#fdd',
          border: '1px solid red',
          padding: '10px',
          margin: '10px 0'
        }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameChange}
          />
        </div>

        <div>
          number: <input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Numbers</h2>

      {persons.map(person =>
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id, person.name)}>
            delete
          </button>
        </div>
      )}
    </div>
  )
}

export default App
