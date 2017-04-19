import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';
import CustomNavbar from '../Navigation/CustomNavbar';
import * as api from '../../../api';
import superagent from 'superagent';

class About extends Component {
  componentDidMount() {
    superagent
      .get("http://localhost:8090/api/v1/userPreferences")
      .set('Accept', 'text/json')
      .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
      .set('Access-Control-Allow-Origin', '*')
      .end((error, response) => {
        if(error) {
          console.log(error);
        } else {
          console.log(response.body);          
        }
      });
  }

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