import React, { Component } from 'react';
import {Marker} from 'react-google-maps';

// Generate a custom Google maps markers
class CustomMarker extends Component {
  render() {
  	const marker = this.props.marker;
  	return (
          <Marker
	            {...marker}
	            position={marker.position}
	            defaultAnimation={2}
	            key={this.props.id}>
          </Marker>
  	);
  }
}

export default CustomMarker;