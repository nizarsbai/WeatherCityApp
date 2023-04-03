import { LightningElement, wire } from 'lwc';
import getCities from '@salesforce/apex/CityController.getCities';
import { MessageContext, publish } from 'lightning/messageService';
import villeWeather from '@salesforce/messageChannel/villeWeather__c';
import getWeather from '@salesforce/apex/WeatherController.getWeather';

export default class PicklistVille extends LightningElement {
  billingCityOptions = [];
  selectedCity = '';
  weatherDetails;
  temperature;
  country;
  humidity;
  description;

  @wire(MessageContext)
  messageContext;

  @wire(getCities)
  wiredAccountData({ error, data }) {
    if (data) {
      this.billingCityOptions = data.map(city => {
        return {
          label: city,
          value: city
        };
      });
    } else if (error) {
      console.error(error);
    }
  }


  handleCitySelected(event) {
    this.selectedCity = event.detail.value;
    console.log(this.selectedCity);
    // const citySelectedEvent = new CustomEvent('cityselected', { detail: { city: selectedCity } });
    // this.dispatchEvent(citySelectedEvent);
  }

  handleAccountVilleClick() {

    if(this.selectedCity) {

        getWeather({city: this.selectedCity})
        .then((result) => {

            console.log(result);
            this.weatherDetails = result;
            this.temperature = result.temperature;
            this.humidity = result.humidity;
            this.description = result.description;
            // this.humidity = result.humidity;
            // this.description = result.description;
            // this.country = result.country;
            //com
            const message = {
                city: this.selectedCity,
                temperature: this.temperature,
                humidity: this.humidity,
                description: this.description
                // humidity: this.humidity,
                // country : this.country,
                // description : this.description,
                // weatherIconUrl: this.weatherIconUrl
            };


            publish(this.messageContext, villeWeather, message);
            console.log('Ville Séléctionnée:', this.selectedVille);
        })
            // const message = {

            //   city: this.selectedCity
            // }
            publish(this.messageContext, villeWeather, message);
            console.log('Ville Séléctionnée:', this.selectedCity);
    }else {

        console.error('No city selected');
    }

}
}