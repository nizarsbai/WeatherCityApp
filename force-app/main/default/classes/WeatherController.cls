public with sharing class WeatherController {

    private static final String ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
    private static final String API_KEY = '0674d3352d4848ae8342f4b2e876215a';

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getWeather(String city) {

        Map<String, Object> result = new Map<String, Object>();
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(ENDPOINT + '?q=' + EncodingUtil.urlEncode(city, 'UTF-8') + '&appid=' + API_KEY);
        request.setMethod('GET');
        try {
            HttpResponse response = http.send(request);
            if (response.getStatusCode() == 200) {
                Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());
                result.put('city', (String)jsonResponse.get('name'));
                result.put('country', (String)((Map<String, Object>)jsonResponse.get('sys')).get('country'));
                List<Object> weatherList = (List<Object>)jsonResponse.get('weather');
                result.put('description', ((Map<String, Object>)weatherList[0]).get('description'));
                result.put('temperature', ((Map<String, Object>)jsonResponse.get('main')).get('temp'));
                result.put('humidity', ((Map<String, Object>)jsonResponse.get('main')).get('humidity'));
            }
        } catch (Exception e) {
            result.put('error', e.getMessage());
        }
        
        return result;
    }
}
