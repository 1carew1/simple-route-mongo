import React, { Component } from 'react';
import {Form , FormGroup, ControlLabel , FormControl  ,Button} from 'react-bootstrap';
import {browserHistory} from 'react-router';

import GoogleMapsService from '../../../utils/GoogleMapsService';

const googleMapsService = new GoogleMapsService();

class FlyToLocationForm extends Component {

  constructor() {
    super();
    this.state = { address: '' };
  }

  handleKeyPress(target) {
      // If enter is pressed
      if(target.charCode===13){
              // Prevent the page from reloading
              target.preventDefault();
              this.goToLocation(); 
      }

  }

  handleChange(event){
    this.setState({address: event.target.value});
  }

  goToLocation(){
    browserHistory.push('/home');
    const address = this.state.address;
    console.log('Going to location : ' + address);
        // Take in a list of addresses and goes to the first one
    let flyToAddress = (addresses) => {
      if(addresses) {
        const addressIdentifier = 'addresses';
        localStorage.removeItem(addressIdentifier);
        localStorage.setItem(addressIdentifier, JSON.stringify(addresses));

        // Reload the page
        const address = addresses[0]
        if(address) {
            const newCenter = addresses[0].location;
            if(newCenter) {
              console.log('New Lat Lng is : ' + newCenter.lat + ' ' + newCenter.lng);
              this.props.closeModal();  
              this.props.centerLocation(newCenter);     
            }            
        } else {
          console.log('Did not find an address from Google Maps');
          alert('Invalid Address');
        }        
      } else {
        console.log('No addresses found');
      }
    }

    let findDesiredAddress = (desiredAddress) => {
      googleMapsService.obtainLatLngFromAddress(desiredAddress, flyToAddress);
    }
    findDesiredAddress(address);
  }

  render() {
  	return (
      <Form onKeyPress={this.handleKeyPress.bind(this)} >
        <FormGroup controlId="formInlineName">
          <ControlLabel>Location</ControlLabel>
          {' '}
          <FormControl type="text" placeholder="Waterford Institue of Technology" onChange={this.handleChange.bind(this)} />
        </FormGroup>
        {' '}
        {' '}
        <Button bsStyle="primary" onClick={this.goToLocation.bind(this)}>
          Go
        </Button>
      </Form>
  	);
  }
}

export default FlyToLocationForm;