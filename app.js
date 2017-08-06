const yargs = require('yargs'),
      axios = require('axios');

const argv = yargs
  .options({
    a: {
      describe: 'Address to fetch weather for',
      demand: true,
      string: true,
      alias: 'address'
    }
  })
  .alias('help', 'h')
  .help()
  .argv;

const encodedAddress = encodeURIComponent(argv.address);

let geocodeUrl = 'http://maps.googleapis.com/maps/api/geocode/json';
const url = `${geocodeUrl}?address=${encodedAddress}`;

axios.get(url)
  .then((response) => {
    let address = response.data.results[0].formatted_address;

    if ( response.data.status === 'ZERO_RESULTS' ) {
      throw new Error(`The Google Geocode API could not locate '${argv.address}'.`);
    }

    let { lat, lng } = response.data.results[0].geometry.location;

    let apiKey = '7f5c1aa8ac29c8f5c3e9671f7e683122';

    const weatherUrl = `https://api.forecast.io/forecast/${apiKey}/${lat},${lng}`;

    console.log(`\nAt ${address}:`);
    return axios.get(weatherUrl);
  })
  .then((response) => {
    let { temperature: actual, apparentTemperature: apparent } = response.data.currently;

    console.log(`It's currently ${actual} degrees.`);
    console.log(`It feels like ${apparent} degrees.`);
  })
  .catch((error) => {
    if ( error.code === 'ENOTFOUND' ) {
      console.log('There was a problem connecting to the Google Geocode API.');
    } else {
      console.log(error.message);
    }
  });
