import {useState, useEffect} from 'react'
import axios from 'axios'

const Weather =({country}) =>{
  const [weather,setWeather] = useState({})
  useEffect(()=>{
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]
    const api_key = process.env.REACT_APP_API_KEY
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather/?lat=${lat}&units=metric&lon=${lon}&appid=${api_key}`)
    .then(response => {
      setWeather(response.data)
    })
  },[country])
  if (!(Object.keys(weather).length === 0)){
    console.log('weather', weather)
    return(
      <>
      <h2>Weather in {country.name.common}</h2>
      <p>temperature {weather.main.temp}</p>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt='weather'></img>
      <p>wind {weather.wind.speed}</p>
      </>
    )
  }

}

const Viev = ({country}) =>{
  return(
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <p>languages</p>
      <ul>
        {Object.values(country.languages).map((lan, index) => {
          return <li key={index}><p>{lan}</p></li>
        })}
      </ul>
      <img src={country.flags.svg} alt='Flag of the country'/>
      <Weather country={country}/>
    </div>
)
}

const CountryList =({country}) => {
  const [click, setClick] =useState(false)
  return(
    <div >
      <p>{country.name.common}</p>
      <button onClick={() => {setClick(!click)}} country={country}>{click? 'hide':'show' }</button>
      {click ?<Viev  country={country}/> : ''}
    </div>
  )
}

const Countries =({countries}) => {

  if (countries.length >10) {
    return(
      <p>Too many matches, try to be more specific</p>
    )
  }
  else if (countries.length === 1){
    return(
     countries.map((country, index) => <Viev key={index} country={country} />)
    )
  }
  else{
    return(
      countries.map((country) => {
        return(
          <CountryList key={country.name.official} country={country}/>
        )})
    )
  }
}


const App= () => {

const [search, setSearch] = useState('')
const [countries, setCountries] = useState([])


useEffect(()=>{
  axios
  .get('https://restcountries.com/v3.1/all')
  .then(response =>{
    setCountries(response.data)
  })
},[])

const filter = countries.filter(country =>{
  return(
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )
})
const handleChange =(e) => setSearch(e.target.value)

  return (
   <div>
    <p>find countries</p>
    <input
      placeholder='Country name...'
      onChange={handleChange}
      value ={search}
    />
    <Countries countries={filter} />
   </div>
  );
}

export default App;
