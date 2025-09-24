import React from 'react'

// Function Component: Displays current weather
export function CurrentWeatherCard({ city, weather, isHot, isLoading, errorMessage }) {
  return (
    <section className="card current-weather">
      <h2>Current Weather</h2>
      <div className="card-body">
        {isLoading && <div className="status">Loading...</div>}
        {!isLoading && errorMessage && (
          <div className="status error" role="alert">{errorMessage}</div>
        )}
        {!isLoading && !errorMessage && weather && (
          <div className="weather-row">
            <div className="primary">
              <div className="city">{city}</div>
              <div className="temp">{Math.round(weather.tempCelsius)}°C</div>
              <div className="condition">{weather.condition}</div>
              <div className="hot-flag">{isHot ? '🔥 Hot' : '❄️ Mild'}</div>
            </div>
            <div className="secondary">
              <div>Feels like: {Math.round(weather.feelsLikeCelsius)}°C</div>
              <div>Humidity: {weather.humidity}%</div>
              <div>Wind: {Math.round(weather.windKmh)} km/h</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

