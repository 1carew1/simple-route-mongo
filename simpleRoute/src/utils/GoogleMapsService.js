import superagent from 'superagent';
import googleConfig from '../../config/googleMapsAPIKey.json';

const apiKey = googleConfig.apiKey;
const geoCodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const reverseGeoCodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';

export default class GoogleMapsService {
  // Pass in a LatLng and a function to call once the work has been done
  obtainAddressesNearLatLng(latlng, func){
    if(latlng && latlng.lat && latlng.lng) {
      const url = reverseGeoCodeUrl + latlng.lat+ ',' + latlng.lng+ '&key=' + apiKey;
      // Run Superagent to get API Requests e.g. Google Maps Geocoding
      this.useSuperagentToObtainResultsFromUrl(url, func);     
    } else {
       console.log('Not a valid lat lng');
    }
  }


  // Pass in an address and a function to call once the work has been done
  obtainLatLngFromAddress(address, func) {
    let desiredAddress = address;
    if(desiredAddress) {
      console.log('Going to try Find LatLng Information of : ' + desiredAddress);
      desiredAddress = desiredAddress.replace(' ', '+');
      const url = geoCodeUrl + desiredAddress + '&key=' + apiKey;
      this.useSuperagentToObtainResultsFromUrl(url, func);
    } else {
      console.log('Desired Address is blank so will not look for that');
    }
  }

  // TODO : Pass a function into this that is called when a response is obtain and then this function can update the Google Map
  useSuperagentToObtainResultsFromUrl(url, func) {
      superagent
      .get(url)
      .query(null)
      .set('Accept', 'text/json')
      .end((error, response) => {
          const results = response.body.results;
          const addresses = results.map((obj, i) => {
              let address = {
                formatted_address : '',
                location : {}
              }
              address.formatted_address = obj.formatted_address;
              address.location = obj.geometry.location;
              return address;
          });
          if(addresses) {
            // Call the function passed in using the addresses paramater
            func(addresses);
          } else {
            console.log('No Addresses found');
          }
       });
  }

  generateMapOptions(options) {
    let travelMode = 'DRIVING';
    let unitSystem = window.google.maps.UnitSystem.METRIC;
    let avoidTolls = false;
    let avoidHighways = false;

    if(options) {
      if(options.travelMode) {
        travelMode = options.travelMode;
      }
      if(options.unitSystem === 'IMPERIAL') {
        unitSystem = window.google.maps.UnitSystem.IMPERIAL;
      }
      if(options.avoidTolls) {
        avoidTolls = true;
      }
      if(options.avoidHighways) {
        avoidHighways = true;
      }
    }
    const directionsFor = {
      waypoints: [],
      provideRouteAlternatives: true,
      travelMode: travelMode,
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: 'pessimistic'
      },
      unitSystem: unitSystem,
      avoidTolls : avoidTolls,
      avoidHighways : avoidHighways
    };
    return directionsFor;
  }

  //TODO : Add some logic so the user can pick which route: quickest, shortest, easiest
  obtainDirectionsWithOptions(startAddress, endAddress, func, options) {
    let directions = [];

    let directionsFor = this.generateMapOptions(options);
    directionsFor.origin = startAddress;
    directionsFor.destination = endAddress;

    let directionsService = new window.google.maps.DirectionsService();
    directionsService.route(directionsFor, function(result, status) {
      if (status === 'OK' && result.routes) {
        console.log('Routes :');
        let routes = result.routes;
        let simplestRoute = null;
        routes.forEach(function(route) {
          console.log('This route has ' + route.legs[0].steps.length + ' turns and will take ' + route.legs[0].duration.text + ' with a distance of ' + route.legs[0].distance.text);
          if(!simplestRoute) {
            simplestRoute = route;
          } else if(route.legs[0].steps.length < simplestRoute.legs[0].steps.length) {
            simplestRoute = route;
          } else {
            //Do nothing as it's already shorter
          }
        });
        // remove all routes from the result and put in the simplest one only!
        result.routes = [];
        result.routes.push(simplestRoute);
        func(result);


        let simplestRouteLeg = simplestRoute.legs[0];
        console.log('The simplestRoute has ' + simplestRouteLeg.steps.length + ' turns and will take around' + simplestRouteLeg.duration.text + ', the distance is ' + simplestRouteLeg.distance.text);

        simplestRouteLeg.steps.forEach(function(step) {
          directions.push(step.instructions + ' for ' + step.distance.text);
          //console.log(step.instructions + ' for ' + step.distance.text);
        });
      } else {
        alert('No Valid routes for : ' + startAddress + ', to : ' + endAddress );
        console.log('Did not get valid routes');
      }
    });   
  }

  obtainDirections(startAddress, endAddress, func){
    this.obtainDirectionsWithOptions(startAddress, endAddress, func, null);
  }
}
