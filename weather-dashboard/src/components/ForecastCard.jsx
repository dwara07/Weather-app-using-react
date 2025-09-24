import React, { Component } from 'react'

// Class Component: Displays 5-day forecast
export class ForecastCard extends Component {
  render() {
    const { forecast } = this.props

    return (
      <section className="card forecast">
        <h2>5-Day Forecast</h2>
        <div className="card-body">
          {(!forecast || forecast.length === 0) && (
            <div className="status">No forecast available</div>
          )}
          <ul className="forecast-list">
            {forecast && forecast.map((day) => (
              <li className="forecast-item" key={day.date}>
                <div className="date">{day.date}</div>
                <div className="mini-row">
                  <span className="temp-max">{Math.round(day.maxCelsius)}°C</span>
                  <span className="temp-min">{Math.round(day.minCelsius)}°C</span>
                </div>
                <div className="condition">{day.condition}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }
}

