import {useState, useEffect} from 'react'
import phonebook from './services/phonebook'


const Filter = ({change}) => <div><input onChange={change} /></div>


const PersonForm = (props) =>{
  return(
  <form onSubmit={props.newPerson}>
    <div>
      name: <input value={props.newName} onChange={props.nameChange}/>
    </div>
    <div>
      number: <input value={props.newPhone} onChange={props.phoneChange}/>
    </div>
    <div>
      <button type='submit'>add</button>
    </div>
  </form>
  )
}

const Message = ({mess, className}) => {
  if (mess === ''){
    return null
  }
  return (
    <div className={className}>
      <em>{mess}</em>
    </div>
  )
}

const Persons =({persons, setPersons}) => {
  return (<div>
    {persons.map(person => {
          return(<p key={person.id}>{person.name} {person.number} <button onClick={() =>window.confirm(`Are u sure u want to delete ${person.name}?`) ? phonebook.del(person.id).then(setPersons(persons.filter(p=> p.id !== person.id ? p : '' ))):''}>delete</button></p>)
        }
      )
    }
  </div>
  )
}

const App =() =>{

  const[persons,setPersons] =useState([])
  const[newName, setNewName] =useState('')
  const[newPhone, setNewPhone] = useState('')
  const[search, setSearch] = useState('')
  const[mess, setMess] = useState('')
  const[className, setClassName] = useState('')

 useEffect (() =>{
    phonebook
    .getAll()
    .then(current => setPersons(current))
  }, [])


  const newPerson =(e) => {
    e.preventDefault()
    const newObject = {
        name: newName,
        number: newPhone
      }
    persons.findLast(person => {
        if (person.name === newObject.name) {
          if (window.confirm(`${person.name} is already on the list \n Do you wanna to switch numbers?`)){
            phonebook.update(person.id, newObject).then(r => setPersons(persons.map(p => (p.name === r.name) ? r : p) )).catch(error => {
              setPersons(persons.filter(p => p.id !== person.id))
              setClassName('fail')
              setMess(`Person ${person.name} was already deleted`)

            })
            setClassName('success')
            setMess(`The number of ${person.name} was succesfuly switched`)
          }
        }
      });
      if(persons.findIndex(person => person.name === newObject.name) === -1)
      {
        phonebook.create(newObject).then(r => setPersons(persons.concat(r)))
          setClassName('success')
          setMess(`${newObject.name} was added to phonebook`)
      }
    setNewName('')
    setNewPhone('')
  }
 const handleNameChange = (e) => setNewName(e.target.value)
  const handlePhoneChange = (e) => setNewPhone(e.target.value)
  const handleSearch = (e) => setSearch(e.target.value)


  const filter = persons.filter(person => {
        return(
          person.name.toLowerCase().includes(search.toLowerCase())
        )
      })

  return(
    <div>
      <h1>Phonebook</h1>
      <Message mess={mess} className={className} />
      <Filter change ={handleSearch}/>
      <h2>Add new</h2>
      <PersonForm
        newPerson={newPerson}
        newName={newName}
        newPhone={newPhone}
        nameChange={handleNameChange}
        phoneChange={handlePhoneChange}
        />
      <h2>Numbers</h2>
      <Persons persons={filter} setPersons = {setPersons} />
    </div>
  )
}

export default App;
