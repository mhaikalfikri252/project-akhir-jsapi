const loader = document.getElementById("loading");

// showing loading
function displayLoading() {
  loader.classList.add("display");
  // to stop loading after some time
  setTimeout(() => {
    loader.classList.remove("display");
  }, 5000);
}

// hiding loading
function hideLoading() {
  loader.classList.remove("display");
}

const getWeatherForecast = async (cityName) => {
  displayLoading();

  try {
    const response = await fetch(
      `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${cityName}&days=3`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
          "x-rapidapi-key":
            "17adc5d358mshf312c681d72d782p1da337jsnd1ec4fac79a3",
        },
      }
    );
    const data = await response.json();
    hideLoading();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

const displayCityName = (weatherData) => {
  const cityNameDiv = document.getElementById("city-description");
  const cityName = weatherData.location.name;
  const countryName = weatherData.location.country;

  const element = `<h2>Showing the weather of ${cityName}, ${countryName}<h2>`;

  cityNameDiv.innerHTML = element;
};

const displayCurrentWeather = (weatherData) => {
  const currentWeatherDiv = document.getElementById("current-weather");

  const currentWeather = {
    condition: weatherData.current.condition.text,
    conditionImage: weatherData.current.condition.icon,
    temperature: weatherData.current.temp_c,
    humidity: weatherData.current.humidity,
    time: weatherData.current.last_updated,
  };

  const element = `
  <div class="weather-container">
    <h2>Current Weather</h2>
    <p style="text">"${currentWeather.condition}"</p>
    <img src="https:${currentWeather.conditionImage}" class="weather-image">
    <p>temperature: ${currentWeather.temperature}℃</p>
    <p>humidity: ${currentWeather.humidity}%</p>
    <p>(updated at ${currentWeather.time})</p>
  </div>
  `;

  currentWeatherDiv.innerHTML = element;
};

const displayWeatherForecast = (weatherData) => {
  const forecastDiv = document.getElementById("weather-forecast");
  forecasts = weatherData.forecast.forecastday;

  let listOfElement = "";
  for (let i = 0; i < forecasts.length; i++) {
    const forecastData = {
      date: forecasts[i].date,
      condition: forecasts[i].day.condition.text,
      conditionImage: forecasts[i].day.condition.icon,
      avg_temp: forecasts[i].day.avgtemp_c,
      max_temp: forecasts[i].day.maxtemp_c,
      min_temp: forecasts[i].day.mintemp_c,
      avg_humidity: forecasts[i].day.avghumidity,
    };

    const element = `
    <div class="weather-container">
      <h2>Weather for ${forecastData.date}</h2>
      <p style="text">"${forecastData.condition}"</p>
      <img src="https:${forecastData.conditionImage}" class="weather-image">
      <p>Average Temperature: ${forecastData.avg_temp}℃</p>
      <p>(Maximum: ${forecastData.max_temp}℃, Minimum: ${forecastData.min_temp}℃)</p>
      <p>Average Humidity: ${forecastData.avg_humidity}%</p>
    </div>
    `;

    listOfElement += element;
  }

  forecastDiv.innerHTML = listOfElement;
};

const searchWeather = async () => {
  const cityName = document.getElementById("city-name").value;

  if (!cityName) {
    return null;
  }

  const weatherData = await getWeatherForecast(cityName);

  if (weatherData.error) {
    return alert(weatherData.error.message);
  }

  if (!weatherData.error) {
    displayCityName(weatherData);
    displayCurrentWeather(weatherData);
    displayWeatherForecast(weatherData);
  }
};

/**
 * Clearable text inputs
 */
function tog(v) {
  return v ? "addClass" : "removeClass";
}
$(document)
  .on("input", ".clearable", function () {
    $(this)[tog(this.value)]("x");
  })
  .on("mousemove", ".x", function (e) {
    $(this)[
      tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)
    ]("onX");
  })
  .on("touchstart click", ".onX", function (ev) {
    ev.preventDefault();
    $(this).removeClass("x onX").val("").change();
  });
