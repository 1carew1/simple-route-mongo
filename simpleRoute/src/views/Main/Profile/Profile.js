import React, { Component, PropTypes as T } from 'react';
import CustomNavbar from '../Navigation/CustomNavbar';
import ProfileDetails from './ProfileDetails';
import ProfilePreferences from './ProfilePreferences';
import ProfileDirections from './ProfileDirections';

import AuthService from '../../../utils/AuthService';

class About extends Component {
  constructor(props, context) {
      super(props, context);
      this.state = {
        profile: props.auth.getProfile()
      };
      props.auth.on('profile_updated', (newProfile) => {
        this.setState({profile: newProfile})
      });
  }

  static propTypes = {
    auth: T.instanceOf(AuthService)
  }

  render() {
  	return (
  		<div>
  		  <CustomNavbar disableMapOptions={true}/>
        <ProfileDetails profile={this.state.profile}/>
        <ProfilePreferences profile={this.state.profile}/>
        <ProfileDirections profile={this.state.profile}/>
      </div>
  	);
  }
}

export default About;