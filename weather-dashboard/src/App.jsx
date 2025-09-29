import React, { useEffect, useMemo, useState } from 'react'
import { CurrentWeatherCard } from './components/CurrentWeatherCard.jsx'
import { ForecastCard } from './components/ForecastCard.jsx'
import { fetchCurrentWeather, fetchForecast } from './services/openweather.js'

export default function App() {
  const [city, setCity] = useState('New York') // string
  const [query, setQuery] = useState('New York') // input value
  const [weather, setWeather] = useState(null) // object | null
  const [forecast, setForecast] = useState([]) // array of objects
  const [isLoading, setIsLoading] = useState(false) // boolean
  const [errorMessage, setErrorMessage] = useState('') // string

  const isHot = useMemo(() => {
    if (!weather) return false
    return weather.tempCelsius >= 30 // boolean derived
  }, [weather])

  const handleSearch = async (evt) => {
    evt.preventDefault()
    setCity(query.trim())
  }

  useEffect(() => {
    let isCancelled = false
    async function load() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const [w, f] = await Promise.all([
          fetchCurrentWeather(city),
          fetchForecast(city)
        ])
        if (isCancelled) return
        setWeather(w)
        setForecast(f)
      } catch (err) {
        if (isCancelled) return
        setErrorMessage(err?.message || 'Failed to fetch weather')
        setWeather(null)
        setForecast([])
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }
    load()

    const interval = setInterval(load, 10 * 60 * 1000) // auto-refresh 10 minutes
    return () => {
      isCancelled = true
      clearInterval(interval)
    }
  }, [city])

  return (
    <div className="app-container">
      <header className="header">
        <h1>Weather Dashboard</h1>
      </header>

      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city name"
            aria-label="City name"
          />
          <button type="submit">Search</button>
        </form>
        <div className="hint">Auto-refreshes every 10 minutes. Data by OpenWeather.</div>
      </section>

      <main className="content">
        <div className="cards">
          <CurrentWeatherCard
            city={city}
            weather={weather}
            isHot={isHot}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
          <ForecastCard forecast={forecast} />
        </div>
      </main>

      <footer className="footer">
        <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">OpenWeather</a>
      </footer>
    </div>
  )
}

