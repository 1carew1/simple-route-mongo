import React from 'react';
import {Image, Jumbotron} from 'react-bootstrap';

import './jumbostyle.css';

export class ProfileDetails extends React.Component {
  render() {
    const { profile } = this.props;
    return (
      <Jumbotron className="centerJumbo">
          <a href={profile.picture} target="_blank">
            <Image src={profile.picture}  circle style={{width:'50px'}}/>
          </a>
          <h3>Profile</h3>
          <p><strong>Name: </strong> {profile.name}</p>
          <p><strong>Email: </strong> {profile.email}</p>
      </Jumbotron>
    )
  }
}

export default ProfileDetails;