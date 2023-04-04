var sunrise;
var sunset;
var night;
var apiKey;
var city;

window.wallpaperPropertyListener = {
	applyUserProperties: function(properties) {
		if (properties.sunrise) {
			sunrise = properties.sunrise.value;
		}

		if (properties.sunset) {
			sunset = properties.sunset.value;
		}

		if (properties.night) {
			night = properties.night.value;
		}

		if (properties.apikey) {
			apiKey = properties.apikey.value;
			console.log(apiKey);
		}

		if (properties.city) {
			city = properties.city.value;
			console.log(city);
		}
	}
}

function changeBG(time) {
	if (sunrise <= time && time < sunset) {
		document.body.style.backgroundImage = "url('images/arseniy-chebynkin-oldtokiyo.jpg')";
	} else if (sunset <= time && time < night) {
		document.body.style.backgroundImage = "url('images/arseniy-chebynkin-tokyo-street-sunset.jpg')";
	} else {
		document.body.style.backgroundImage = "url('images/arseniy-chebynkin-tokyo-street-night.jpg')";
	}
}

setInterval(function() {
	var curHour = new Date().getHours();
	changeBG(curHour);
}, 1000);



function getWeather() {
	console.log(apiKey);
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
	const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

	return fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			const { description } = data.weather[0];
			const icon = data.weather[0].icon;
			const { temp, feels_like, temp_min, temp_max, pressure } = data.main;
			const { speed: wind_speed } = data.wind;
			const place = data.name + " " +data.sys.country;
			
			return {
			  weather: {
				description,
				icon,
				temp,
				feels_like,
				temp_min,
				temp_max,
				pressure,
				wind_speed,
			  },
			  request_time: currentTime,
			  place,
			};
		  })
		.catch(error => {
			console.error(error)
			return {
				weather: {
					description: "-",
					icon: "-",
					temp: "-",
					feels_like: "-",
					temp_min: "-",
					temp_max: "-",
					pressure: "-",
					wind_speed: "-",
				  },
				request_time: "-",
				place: "-",
			};
		});
  }
function getWeatherTEST() {
	return {
		weather: {
			description: "overcast clouds",
			icon: "04d",
			temp: "10.5",
			feels_like: "9.46",
			temp_min: "9.24",
			temp_max: "9.24",
			pressure: "1012",
			wind_speed: "4.13",
		},
		request_time: "34:00",
		place: "Moscow RU",
	};	  
}
  
  function renderWeather(data) {
	return `
		<div class="wrapper">
			<div class="mainCard">
				<div>${data.request_time}, ${data.place}.</div>
				<description>${data.weather.description}</description>
				<div class="mainTempCard">
					<img src="https://openweathermap.org/img/wn/${data.weather.icon}.png"></img>
					<temp>${data.weather.temp}°C</temp>
				</div>
			</div>
			<div class="also">
				<div class="feelCard">
					<div>Feels Like:</div>
					<temp>${data.weather.feels_like}°C</temp>
				</div>
				<div class="minMaxCard">
					<div>Min | Max:</div>
					<temp>${data.weather.temp_min}°C | ${data.weather.temp_max}°C</temp>
				</div>
				<div class="windCard">
					<div>pressure | wind speed</div>
					<temp>${data.weather.pressure} hPa | ${data.weather.wind_speed} m/s</temp>
				</div>
			</div>
		</div>
    `;
  }
  
const container = document.querySelector('#weather-container');
// container.innerHTML = renderWeather(getWeatherTEST());

// With some the WE parameters, request may not be sent
// (for example, if the focus is not on the desktop)
// So I workaround this problem
setTimeout(() => {  
	getWeather()
	.then(data => container.innerHTML = renderWeather(data));
	//save request time in hours
	var lastWeatherRequestTimeInHours = Math.floor(new Date().getTime()/(60*60*1000));
	
	setInterval(() => {  
		//get time now in hours
		var nowTimeInHours = Math.floor(new Date().getTime()/(60*60*1000));
		if (nowTimeInHours > lastWeatherRequestTimeInHours) {
			getWeather()
			.then(data => container.innerHTML = renderWeather(data));
		}
	}, 1000);

}, 5000);

 
