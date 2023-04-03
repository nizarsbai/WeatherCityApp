import { LightningElement, api } from 'lwc';
import { subscribe, MessageContext, unsubscribe } from 'lightning/messageService';
import { wire } from 'lwc';
import villeWeather from '@salesforce/messageChannel/villeWeather__c';


//const API_KEY = '0674d3352d4848ae8342f4b2e876215a';

export default class WeatherDetails extends LightningElement {

  selectedCity = '';
  temperature = '';
  humidity = '';
  windSpeed = '';
  description = '';
  //weatherData = null;

  @wire(MessageContext) messageContext;

  // async getWeatherData(city) {
  //   const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
  //   const data = await response.json();
  //   if (data.cod === 200) {
  //     this.weatherData = data;
  //   } else {
  //     console.error('Error fetching weather data:', data.message);
  //     this.weatherData = null;
  //   }
  // }

  connectedCallback() {

    this.subscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    this.subscription = subscribe(
        this.messageContext,
        villeWeather,
        (message) => {
            this.handleMessage(message);
        }
    );
  }

  handleMessage(message) {

    this.selectedCity = message.city;
    this.temperature = Math.trunc((message.temperature) - 273.15);
    this.humidity = message.humidity;
    this.description = message.description;
    console.log('From the Subscriber ' + this.selectedCity);
    // this.temperature = (message.temperature)-273,15;
    // this.humidity = message.humidity;
    // this.weatherDescription = message.description;
    // this.country = message.country;
  }

//   async handleCitySelect(event) {
//     const selectedCity = event.detail;
//     this.selectedCity = selectedCity;
//     await this.getWeatherData(this.selectedCity);
//   }


//   getWeatherForCity(city) {
//     getWeather({ city: city })
//         .then(result => {
//             if (result) {
//                 this.temperature = result.temperature;
//                 this.humidity = result.humidity;
//                 this.windSpeed = result.windSpeed;
//             }
//         })
//         .catch(error => {
//             console.error(error);
//         });
// }

  
//   get error() {
//     return this.weatherData && this.weatherData.cod !== 200;
//   }


/*
  getWeather() {
    getWeatherInfo({ city: this.selectedCity })
      .then(result => {
        this.weatherData = result;
      })
      .catch(error => {
        console.error(error);
      });
  } 
  */

  disconnectedCallback() {

    unsubscribe(this.subscription);
    this.subscription = null;
  }
}
