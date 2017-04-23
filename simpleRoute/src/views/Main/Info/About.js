import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import CustomNavbar from '../Navigation/CustomNavbar';

class About extends Component {
  render() {
  	return (
  		<div>
  		  <CustomNavbar disableMapOptions={true}/>
          <Jumbotron style={{'textAlign': 'center'}}>
            <h2>Simple Route</h2>
            <img src={require("../../../../assets/images/simpleroute.png")} alt="simpleRoute" width="204" height="166" />
            <p style={{marginTop:'14px'}}>The purpose of simple route is primarily to give the user the easiest directions between two locations. Google Maps JS Api is used for this.</p>
            <p>It is written using React with the Create React App tool used for the initial setup. The Github link of this can be found : <a href="https://github.com/1carew1/simple-route" target="_blank">Here</a></p>
          </Jumbotron>
        </div>
  	);
  }
}

export default About;