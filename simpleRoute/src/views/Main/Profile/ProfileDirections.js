import React from 'react';
import {Jumbotron, Table} from 'react-bootstrap';
import FirebaseDatabaseService from '../../../utils/FirebaseDatabaseService';
import StringUtils from '../../../utils/StringUtils';
import {Link} from 'react-router';

import './jumbostyle.css';

const firebaseDatabaseService = new FirebaseDatabaseService();
const stringUtils = new StringUtils();

let tableContents = null;
export class ProfileDirections extends React.Component {

  componentDidMount(){
    let functionToRunOnResults = (results) => {

      if(results) {
       // Ensure the results are in order of most recent descending
       tableContents = results.reverse().map((value, index) => {
          const linkToDirections = 'home/directions/' + value.start_address + '/' + value.end_address;
          return (
                  <tr key={index}>
                    <td><Link to={linkToDirections} >{index + 1}</Link></td>
                    <td>{value.start_address}</td>
                    <td>{value.end_address}</td>
                    <td>{stringUtils.pretifyDateString(value.date_searched)}</td>
                  </tr>
            );
        });      
      } 
      this.setState({});
    }
    firebaseDatabaseService.retrieveLastXDirectionsOfUser(this.props.profile, 10, functionToRunOnResults.bind(this)); 
  }

  render() {
    return (
      <Jumbotron className="centerJumbo">
          <h3>Last 10 Searched Directions :</h3>
          <Table striped bordered condensed hover style={{marginLeft : '10%', width:'80%', marginRight:'10%'}}>
            <thead>
              <tr>
                <th>#</th>
                <th>Start Address</th>
                <th>End Address</th>
                <th>Search Time</th>
              </tr>
            </thead>
            <tbody>
              {tableContents}
            </tbody> 
          </Table>
      </Jumbotron>
    )
  }
}

export default ProfileDirections;