import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { RiSunCloudyLine } from 'react-icons/ri';
import axios from 'axios';
import Loader from './Loader.jsx'

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

 

  const getCoordinates = (city) => {
    const apiKey = '0b054e9cf6f2488baff8686b0a6b9fa6';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      city
    )}&key=${apiKey}`;
    return axios
      .get(url)
      .then((response) => {
        const data = response.data;
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          return { latitude: lat, longitude: lng };
        } else {
          throw new Error('Location not found');
        }
      })
      .catch((error) => {
        setError('Failed to get coordinates');
        return null;
      });
  };

  const fetchWeatherData = (latitude, longitude) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    setLoading(true)
    return axios
      .get(url)
      .then((response) => {
        const data = response.data;
        setWeatherData(data.current_weather);
      })
      .catch((error) => {
        setError('Failed to fetch weather data');
      }).finally(() => setLoading(false))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setWeatherData(null);

    if (!city.trim()) {
      setError('City name cannot be empty');
      return;
    }

    getCoordinates(city).then((coordinates) => {
      if (coordinates) {
        return fetchWeatherData(coordinates.latitude, coordinates.longitude);
      }
    });
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayName = days[date.getDay()];
    const formattedDate = date.toLocaleDateString();
    return `${dayName}, ${formattedDate} `;
  };

  const getWindDirection = (degree) => {
    const directions = [
      'North',
      'North-East',
      'East',
      'South-East',
      'South',
      'South-West',
      'West',
      'North-West',
    ];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  return (
    <div className="min-h-screen bg-[url('https://res.cloudinary.com/duxauobyd/image/upload/v1731062507/bg-weather_ejebop.png')] bg-cover">
      <nav className="flex justify-between p-3">
        <h1 className="text-white font-inter  text-[20px] md:[text-30px] font-semibold">
          WeatherNow
        </h1>
      </nav>
      <div className="flex flex-col justify-center items-center mt-7">
        <h1 className="text-white font-inter text-[16px] md:text-[36px] text-center font-bold mb-3">
          Discover the weather in every city you go{' '}
        </h1>
        <form
          onSubmit={handleSubmit}
          className=""
        >
          <div className="relative w-full max-w-xs md:max-w-lg">
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setError(null);
              }}
              className="w-full h-[50px] p-[8px] pl-[100px] rounded-full border-2 border-[#677079] text-black focus:outline-none"
            />
            <button
              type="submit"
              className="absolute top-0 right-0 transform  text-gray-500  mt-4 mr-4 cursor-pointer"
            >
              <CiSearch size={24} className="cursor-pointer" />
            </button>
          </div>
        </form>
      </div>
      {error && <p className="text-red-500 text-center font-bold">{error}</p>}
      {loading && <Loader />} 
      {weatherData && (
        <div>
          <h2 className="font-inter text-[30px] text-white text-center mt-7">
            Current Weather in {city}
          </h2>
          <div className="flex   justify-center items-center gap-10 text-white mt-7">
            <div>
              <p className="font-inter text-[16px] md:text-[24px]">
                Temperature: {weatherData.temperature}°C
              </p>
              <p className="font-inter text-[16px] leading-[48px] md:text-[24px]">
                Wind Speed: {weatherData.windspeed} km/h
              </p>
              <p className="font-inter text-[16px] md:text-[24px]">
                Wind Direction: {getWindDirection(weatherData.winddirection)}
              </p>
            </div>
            <div>
              <p className="flex justify-center items-center flex-col">
                
                <RiSunCloudyLine size={48} />
                {formatDateTime(weatherData.time)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
