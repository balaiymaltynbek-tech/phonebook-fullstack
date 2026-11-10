
import { useState, useEffect } from 'react'
import personService from './person'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error loading persons:', error)
        setErrorMessage('Something went wrong')
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (!newName || !newNumber) {
      setErrorMessage('Please enter both name and number')
      return
    }

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
        setErrorMessage(null)
      })
      .catch(error => {
        console.error('Error adding person:', error)

        const message =
          error.response?.data?.error || 'Failed to add person'

        setErrorMessage(message)
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(prevPersons =>
            prevPersons.filter(person =>
              String(person._id || person.id) !== String(id)
            )
          )
          setErrorMessage(null)
        })
        .catch(error => {
          console.error('Error deleting person:', error)
          setErrorMessage(`Failed to delete ${name}`)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      {errorMessage && (
        <div style={{
          color: 'red',
          background: '#ffdddd',
          padding: '10px',
          marginBottom: '10px'
        }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={addPerson}>
        <div>
          name:
          <input
            value={newName}
            onChange={event => setNewName(event.target.value)}
          />
        </div>

        <div>
          number:
          <input
            value={newNumber}
            onChange={event => setNewNumber(event.target.value)}
          />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Numbers</h2>

      {persons.map(person => (
        <div key={person._id || person.id}>
          {person.name} {person.number}
          <button
            onClick={() =>
              deletePerson(person._id || person.id, person.name)
            }
          >
            delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default App
