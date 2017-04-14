import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';

class NotFound extends Component {

  render() {
  	return (
  		<Jumbotron style={{textAlign : 'center'}}>
	    	<h1>The Page you are looking for was not found....sorry</h1>
	    </Jumbotron>
  	);
  }
}

export default NotFound;