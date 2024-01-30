
import "./App.css";
import { useState, useEffect } from "react";

const api = {
  key: "b355452662993d17710f8e562541862a",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When the search button is pressed, a fetch call is made to the OpenWeatherMap API.
  const searchPressed = () => {
    setLoading(true);
    setError(null);

    fetch(`${api.base}weather?q=${search}&units=metric&APPID=${api.key}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((result) => {
        setWeather(result);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Conversion function for Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9 / 5) + 32;
  };

  // Use useEffect to handle background image changes based on weather condition
  useEffect(() => {
    if (weather.weather) {
      const condition = weather.weather[0].main.toLowerCase();
      document.body.style.backgroundImage = `url('${getBackgroundImage(condition)}')`;
    }
  }, [weather]);

  // Function to get background image based on weather condition
  const getBackgroundImage = (condition) => {
    switch (condition) {
      case 'clear':
        return 'clear-sky-image.jpg';
      case 'clouds':
        return 'cloudy-image.jpg';
      case 'rain':
        return 'rainy-image.jpg';
      default:
        return 'default-image.jpg';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Display the title (WeatherForYou) */}
        <h1 className="title">WeatherForYou</h1>

        {/* Introduction to WeatherForYou */}
        <h3 className="intro">Welcome to WeatherForYou! Your go-to place for detailed weather information on cities around the globe!</h3>

        {/* Search Box - Input + Button */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Enter city/town..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-button" onClick={searchPressed}>Search</button>
        </div>

        {/* Display loading indicator */}
        {loading && <p>Loading...</p>}

        {/* Display error message if there is an issue with the API request */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display results from the API if weather is defined */}
        {typeof weather.main !== "undefined" && !loading ? (
          <div>
            {/* Display City/Town */}
            <p>{weather.name}</p>

            {/* Display Temperature in Celsius and Fahrenheit */}
            <p>{weather.main.temp}°C / {celsiusToFahrenheit(weather.main.temp)}°F</p>

            {/* Display Weather Condition (e.g., Sunny) */}
            <p>{weather.weather[0].main}</p>
            <p>({weather.weather[0].description})</p>

            {/* Display Date and Time */}
            <p>{new Date(weather.dt * 1000).toLocaleString()}</p>

            {/* Display Weather Icon */}
            {weather.weather[0].icon && (
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt="weather icon"
                className="weather-icon" // Add a class to the image
              />
            )}
          </div>
        ) : (
          // If weather is undefined, display nothing
          ""
        )}
      </header>
    </div>
  );
}

export default App;
