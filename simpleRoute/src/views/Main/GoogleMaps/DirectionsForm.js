import React, { Component } from 'react';
import {Form , FormGroup, ControlLabel , FormControl  ,Button} from 'react-bootstrap';
import {browserHistory} from 'react-router';

class DirectionsForm extends Component {
  constructor(props, context) {
      super(props, context);
      this.state = {
        startAddress: '',
        endAddress: ''
      };
  }

  handleStartAddressChange(event){
    this.setState({startAddress: event.target.value});
  }

  handleEndAddressChange(event){
    this.setState({endAddress: event.target.value});
  }

  handleKeyPress(target) {
      // If enter is pressed
      if(target.charCode===13){
              // Prevent the page from reloading
              target.preventDefault();
              this.obtainDirections(); 
      }
  }


  obtainDirections() {
    browserHistory.push('/home/directions/' + this.state.startAddress + '/' + this.state.endAddress);
    this.props.setDirectionsOnMap(this.state.startAddress, this.state.endAddress);
    this.props.closeModal(); 
  }
  render() {
  	return (
	      <Form onKeyPress={this.handleKeyPress.bind(this)} >
	        <FormGroup controlId="formInlineName">
	          <ControlLabel>Starting Address</ControlLabel>
	          {' '}
	          <FormControl type="text" placeholder="Waterford Institue of Technology" onChange={this.handleStartAddressChange.bind(this)} />
	        </FormGroup>
	        {' '}
	        {' '}
	        <FormGroup controlId="formInlineName">
	          <ControlLabel>End Address</ControlLabel>
	          {' '}
	          <FormControl type="text" placeholder="City Square" onChange={this.handleEndAddressChange.bind(this)} />
	        </FormGroup>
	        {' '}
	        {' '}
	        <Button bsStyle="primary" onClick={this.obtainDirections.bind(this)}>
	          Direct Me
	        </Button>
	      </Form>
  	);
  }
}

export default DirectionsForm;