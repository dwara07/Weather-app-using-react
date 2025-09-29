const API_BASE = 'https://api.openweathermap.org/data/2.5'
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function toCelsius(kelvin) {
  return kelvin - 273.15
}

function toKmh(ms) {
  return ms * 3.6
}

export async function fetchCurrentWeather(cityName) {
  if (!API_KEY) {
    throw new Error('Missing OpenWeather API key (VITE_OPENWEATHER_API_KEY)')
  }
  const url = `${API_BASE}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Weather error ${res.status}: ${text}`)
  }
  const json = await res.json()
  return {
    tempCelsius: toCelsius(json.main.temp),
    feelsLikeCelsius: toCelsius(json.main.feels_like),
    humidity: json.main.humidity,
    windKmh: toKmh(json.wind.speed),
    condition: json.weather?.[0]?.description ?? 'N/A',
    icon: json.weather?.[0]?.icon ?? null
  }
}

export async function fetchForecast(cityName) {
  if (!API_KEY) {
    throw new Error('Missing OpenWeather API key (VITE_OPENWEATHER_API_KEY)')
  }
  const url = `${API_BASE}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Forecast error ${res.status}: ${text}`)
  }
  const json = await res.json()
  // Group 3-hour entries by day, compute min/max and pick a representative condition
  const byDate = new Map()
  for (const entry of json.list) {
    const date = entry.dt_txt.split(' ')[0]
    const current = byDate.get(date) || {
      temps: [],
      conditions: []
    }
    current.temps.push(toCelsius(entry.main.temp))
    current.conditions.push(entry.weather?.[0]?.description ?? 'N/A')
    byDate.set(date, current)
  }
  const days = Array.from(byDate.entries())
    .slice(0, 5)
    .map(([date, data]) => {
      const maxCelsius = Math.max(...data.temps)
      const minCelsius = Math.min(...data.temps)
      const condition = data.conditions.sort((a, b) =>
        data.conditions.filter(v => v === a).length - data.conditions.filter(v => v === b).length
      ).pop()
      return { date, maxCelsius, minCelsius, condition }
    })
  return days
}

