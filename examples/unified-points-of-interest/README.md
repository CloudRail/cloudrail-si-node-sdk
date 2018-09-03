# Unified Points Of Interest example

This is a simple example that shows how you can easily access different POI services with node.js using the [CloudRail Unified Points of Interest API](https://cloudrail.com/integrations/interfaces/PointsOfInterest;platformId=Nodejs).

## Prerequisites

You need to have node.js installed ([get it from here](http://nodejs.org/)) and need to have developer credentials for the services you want to use. Instructions on how they can be acquired can be found on our [Unified Points Of Interest API site](https://cloudrail.com/integrations/interfaces/PointsOfInterest;platformId=Nodejs;serviceIds=Foursquare%2CGooglePlaces%2CYelp). You also need a CloudRail API key that you can [get here](https://cloudrail.com/signup).

Install the cloudrail-si node.js SDK by navigating to the project folder in a terminal and executing the command

```
npm install --save cloudrail-si
```

Find the following piece of code in your *index.js* file, comment the services you don't want to use, and enter your developer credentials for the other services:

```javascript
cloudrail.Settings.setKey("[Your CloudRail Key]");

const foursquare = new cloudrail.services.Foursquare(null, "[Foursquare Client Identifier]", "[Foursquare Client Secret]");
const googleplaces = new cloudrail.services.GooglePlaces(null, "[Places API Key]");
const yelp = new cloudrail.services.Yelp(null,     "[Yelp Consumer Key]", "[Yelp Consumer Secret]", "[Yelp Token]", "[Yelp Token Secret]");

findPois(foursquare, "Foursquare");
findPois(googleplaces, "Google Places");
findPois(yelp, "Yelp");
```

## Using the program

For each POI service, the program will perform a search for "pizza" in the category "restaurant" within the same area, and show the results.