public with sharing class CityController {
    @AuraEnabled(cacheable=true)
    public static List<String> getCities() {
        Set<String> citiesSet = new Set<String>();
        for (Account acc : [SELECT BillingCity FROM Account WHERE  BillingCity != null]) {
            citiesSet.add(acc.BillingCity);
        }
        List<String> citiesList = new List<String>(citiesSet);
        citiesList.sort();
        return citiesList;
    }
}