const WeatherService = (() => {
  const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
  const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  const CACHE_DURATION = 10 * 60 * 1000; 

  let cache = {
    data: null,
    timestamp: null,
  };

  const isCacheValid = () => {
    return cache.data && Date.now() - cache.timestamp < CACHE_DURATION;
  };

  const getCoordinates = async (city = 'Barranquilla') => {
    try {
      console.log('Buscando coordenadas de:', city);
      
      const response = await fetch(
        `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=es&format=json`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Respuesta no es JSON válido');
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`Ciudad no encontrada: ${city}`);
      }

      const result = data.results[0];
      console.log(`Coordenadas encontradas: ${result.latitude}, ${result.longitude}`);
      
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country
      };
    } catch (error) {
      console.error('Error al obtener coordenadas:', error.message);
      throw error;
    }
  };

  const fetchWeather = async (city = 'Barranquilla') => {
    if (isCacheValid()) {
      console.log('Datos del caché');
      return cache.data;
    }

    try {
      const coords = await getCoordinates(city);
      
      const url = `${BASE_URL}?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code,relative_humidity_2m&timezone=auto`;
      console.log(' Obteniendo clima...');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Respuesta HTTP:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Respuesta no es JSON válido');
      }

      const data = await response.json();
      
      if (!data.current) {
        throw new Error('Datos de clima incompletos');
      }

      console.log('Datos de clima recibidos:', data);

      const formattedData = {
        name: coords.name,
        sys: { country: coords.country },
        main: {
          temp: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m
        },
        weather: [{
          code: data.current.weather_code,
          description: getWeatherDescription(data.current.weather_code)
        }],
        current: data.current
      };

      cache = { data: formattedData, timestamp: Date.now() };

      return formattedData;
    } catch (error) {
      console.error(' Error al obtener el clima:', error.message);
      throw error;
    }
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Despejado',
      1: 'Principalmente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Neblina',
      48: 'Helada',
      51: 'Lluvia ligera',
      53: 'Lluvia moderada',
      55: 'Lluvia intensa',
      61: 'Lluvia débil',
      63: 'Lluvia moderada',
      65: 'Lluvia fuerte',
      71: 'Nieve débil',
      73: 'Nieve moderada',
      75: 'Nieve fuerte',
      80: 'Chubascos débiles',
      81: 'Chubascos moderados',
      82: 'Chubascos fuertes',
      85: 'Chubascos de nieve débiles',
      86: 'Chubascos de nieve fuertes',
      95: 'Tormenta',
      96: 'Tormenta con granizo',
      99: 'Tormenta violenta'
    };
    return descriptions[code] || 'Desconocido';
  };

  return { fetchWeather };
})();
