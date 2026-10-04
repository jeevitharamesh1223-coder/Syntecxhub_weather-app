import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "your-real-api-key";
  // Runs whenever searchedCity changes
  useEffect(() => {
    if (!searchedCity) {
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError("");
      setWeather(null);
      setForecast([]);

      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            searchedCity
          )}&appid=${API_KEY}&units=metric`
        );

        if (!weatherResponse.ok) {
          throw new Error("City not found.");
        }

        const weatherData = await weatherResponse.json();

        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            searchedCity
          )}&appid=${API_KEY}&units=metric`
        );

        if (!forecastResponse.ok) {
          throw new Error("Could not get forecast data.");
        }

        const forecastData = await forecastResponse.json();

        setWeather(weatherData);

        const dailyForecast = forecastData.list.filter((item) =>
          item.dt_txt.includes("12:00:00")
        );

        setForecast(dailyForecast.slice(0, 5));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [searchedCity]);

  // Runs when Search button is clicked
  const searchWeather = () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setSearchedCity(city.trim());
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">
          🌤️ Weatherly
        </div>

        <div className="header-text">
          Live Weather
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">

        {!weather && !loading && (
          <section className="hero">

            <div className="hero-icons">
              ☀️ ☁️ 🌧️
            </div>

            <h1>
              Know Your <span>Weather</span>
            </h1>

            <p>
              Get real-time weather information and forecasts
              for any city around the world.
            </p>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search for a city..."
                value={city}
                onChange={(event) => setCity(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    searchWeather();
                  }
                }}
              />

              <button onClick={searchWeather}>
                🔍 Search
              </button>
            </div>

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <div className="features">
              <div>
                🌡️
                <span>Current Weather</span>
              </div>

              <div>
                📅
                <span>5-Day Forecast</span>
              </div>

              <div>
                🌍
                <span>Worldwide</span>
              </div>
            </div>

          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading">
            <div className="loader"></div>
            <p>Getting weather information...</p>
          </div>
        )}

        {/* Weather Result */}
        {weather && !loading && (
          <section className="weather-section">

            <button
              className="back-button"
              onClick={() => {
                setWeather(null);
                setForecast([]);
                setError("");
                setSearchedCity("");
              }}
            >
              ← Search another city
            </button>

            <div className="weather-card">

              <div className="location">
                <span>📍</span>
                <h2>
                  {weather.name}, {weather.sys.country}
                </h2>
              </div>

              <img
                className="weather-icon"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />

              <div className="temperature">
                {Math.round(weather.main.temp)}°C
              </div>

              <p className="condition">
                {weather.weather[0].description}
              </p>

              <div className="weather-details">

                <div className="detail">
                  <span className="detail-icon">💧</span>
                  <span>Humidity</span>
                  <strong>{weather.main.humidity}%</strong>
                </div>

                <div className="detail">
                  <span className="detail-icon">💨</span>
                  <span>Wind</span>
                  <strong>{weather.wind.speed} m/s</strong>
                </div>

                <div className="detail">
                  <span className="detail-icon">🌡️</span>
                  <span>Feels Like</span>
                  <strong>
                    {Math.round(weather.main.feels_like)}°C
                  </strong>
                </div>

              </div>

            </div>

            {/* Forecast */}
            {forecast.length > 0 && (
              <div className="forecast">

                <h2>5-Day Forecast</h2>

                <div className="forecast-list">

                  {forecast.map((day, index) => (

                    <div
                      className="forecast-card"
                      key={index}
                    >

                      <p>
                        {new Date(day.dt_txt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                          }
                        )}
                      </p>

                      <img
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt={day.weather[0].description}
                      />

                      <strong>
                        {Math.round(day.main.temp)}°C
                      </strong>

                      <span>
                        {day.weather[0].description}
                      </span>

                    </div>

                  ))}

                </div>

              </div>
            )}

          </section>
        )}

      </main>

      <footer>
        Weatherly • Powered by OpenWeather
      </footer>

    </div>
  );
}

export default App;