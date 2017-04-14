import React, { Component } from 'react';
import {InfoWindow} from 'react-google-maps';


class CustomInfoWindow extends Component {
  render() {
  	return (
  		  	<InfoWindow 
                  options={{disableAutoPan:true}}
                  onCloseclick={(e) => { this.setState({ showInfoWindow: false }) }}>
                      <div className="container">
						  <h2>{this.props.content}</h2>
						  <p>The .table-bordered class adds borders to a table:</p>            
						  <table className="table table-bordered">
						    <thead>
						      <tr>
						        <th>Firstname</th>
						        <th>Lastname</th>
						        <th>Email</th>
						      </tr>
						    </thead>
						    <tbody>
						      <tr>
						        <td>John</td>
						        <td>Doe</td>
						        <td>john@example.com</td>
						      </tr>
						    </tbody>
						  </table>
						</div>
            </InfoWindow>
  	);
  }
}

export default CustomInfoWindow;