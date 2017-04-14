import React, { PropTypes as T } from 'react';
import AuthService from '../../../utils/AuthService';
import GoogleMapsService from '../../../utils/GoogleMapsService';
import Map from '../GoogleMaps/Map';

import CustomNavbar from '../Navigation/CustomNavbar';
import FirebaseDatabaseService from '../../../utils/FirebaseDatabaseService';

const firebaseDatabaseService = new FirebaseDatabaseService();

const googleMapsService = new GoogleMapsService();
let directions = null;

export class Home extends React.Component {

  constructor(props, context) {
      super(props, context);
      this.state = {
        profile: props.auth.getProfile(),
        location : null
      };
      props.auth.on('profile_updated', (newProfile) => {
        this.setState({profile: newProfile});
        //Read The User Data for Maps Preferences - if they havent logged in before
        firebaseDatabaseService.readUserData(newProfile);
      });
  }

  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  componentDidMount() {
    // Get Current Location
    if (navigator && navigator.geolocation) {
           navigator.geolocation.getCurrentPosition((pos) => {
                const coords = pos.coords;
                let currentLocation = {
                        lat: parseFloat(coords.latitude),
                        lng: parseFloat(coords.longitude)
                };
                const currentLocationIdentifier = 'currentLocation';
                localStorage.removeItem(currentLocationIdentifier);
                localStorage.setItem(currentLocationIdentifier, JSON.stringify(currentLocation));
                // Use google maps service to communicate with Google Maps Api
                googleMapsService.obtainAddressesNearLatLng(currentLocation, this.storeAddressesInLocalStorage.bind(this));
            })
    }

    this.obtainDirectionAddressFromUrl();
  }

  obtainDirectionAddressFromUrl() {
    const fromLocation = this.props.params.fromLocation;
    const toLocation = this.props.params.toLocation;
    if(fromLocation && toLocation) {
      this.setDirectionsOnMap(fromLocation, toLocation);
    } 
  }


  setDirections(incomingdirections) {
    directions = incomingdirections;
    const profile = this.state.profile;
    firebaseDatabaseService.storeDirectionsInDB(profile, incomingdirections);
    this.setState({});
    directions = null;
  }

  setDirectionsOnMap(fromLocation, toLocation) {
      console.log('Looking for direction from : ' + fromLocation + ', to : ' + toLocation);
      let obtainDirectionsUsingUsersPreferences = (userData) => {
         googleMapsService.obtainDirectionsWithOptions(fromLocation, toLocation, this.setDirections.bind(this), userData);
      }
      const profile = this.state.profile;
      firebaseDatabaseService.readUserDataAndExecuteFunction(profile ,obtainDirectionsUsingUsersPreferences);
  }

  storeAddressesInLocalStorage(addresses) {
    if(addresses) {
        const addressIdentifier = 'addressesNearMe';
        localStorage.removeItem(addressIdentifier);
        localStorage.setItem(addressIdentifier, JSON.stringify(addresses));
        // Reload the page
        this.setState({});      
      } else {
        console.log('No addresses to store');
      }

  }

  centerLocation(incomingLocation) {
    if(incomingLocation && incomingLocation.lat && incomingLocation.lng) {
      console.log('Centering Map Around : ' + incomingLocation.lat + ', ' + incomingLocation.lng);
      localStorage.removeItem('markers');
      let markers = [];
      markers.push(incomingLocation);
      localStorage.setItem('markers', JSON.stringify(markers));
      this.setState({
        location : incomingLocation
      });
      //TODO : Make this also place a marker
    } else {
      console.log('Not a valid lat lng');
    }
  }


  render(){
    const markers = JSON.parse(localStorage.getItem('markers') || '[]');
    localStorage.removeItem('markers');
    return (
    <div style={{height:'100vh', width:'100%'}}>
      <CustomNavbar centerLocation={this.centerLocation.bind(this)} setDirectionsOnMap={this.setDirectionsOnMap.bind(this)}/>
      <div style={{height:'100%', width:'100%'}}>
          <Map center={this.state.location} markers={markers} directions={directions}/>
      </div>
    </div>
    )
  }
}

export default Home;
