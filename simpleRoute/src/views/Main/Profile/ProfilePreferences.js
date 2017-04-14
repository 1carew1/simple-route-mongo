import React from 'react';
import {Jumbotron, ControlLabel, Checkbox} from 'react-bootstrap';

import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

import './jumbostyle.css';

import FirebaseDatabaseService from '../../../utils/FirebaseDatabaseService';

const firebaseDatabaseService = new FirebaseDatabaseService();

export class ProfileDetails extends React.Component {
  constructor() {
      super();
      this.state = {
        travelModeOption : 'DRIVING',
        unit : 'METRIC',
        avoidTolls : false,
        avoidMotorWay : false
      };
  }

  componentDidMount(){
    // Get The User Preferences from DB
    const profile = this.props.profile;
    let updatePreferencesWithDBValues = (dbValues) => {
      this.setState({
        travelModeOption : dbValues.travelMode,
        unit : dbValues.unitSystem,
        avoidTolls : dbValues.avoidTolls,
        avoidMotorWay : dbValues.avoidHighways
      });
    }
    firebaseDatabaseService.readUserDataAndExecuteFunction(profile, updatePreferencesWithDBValues.bind(this));
  }

  onTransportPreferenceSelected(transportItem) {
    if(transportItem && transportItem.value) {
          const profile = this.props.profile;
          if(profile) {
            firebaseDatabaseService.updateUserTravelMode(profile.user_id, transportItem.value);
          }
          this.setState({
            travelModeOption : transportItem.label
          });
    }
  }


  onUnitsSelected(unitsItem) {
    if(unitsItem && unitsItem.value) {
          const profile = this.props.profile;
          if(profile) {
            firebaseDatabaseService.updateUserUnits(profile.user_id, unitsItem.value);
          }

          this.setState({
            unit : unitsItem.label
          });
    }
  }

  onAvoidTollsClicked(event) {
    const profile = this.props.profile;
    const avoidTolls = this.state.avoidTolls;
    this.setState({avoidTolls : !avoidTolls});
    firebaseDatabaseService.updateUserAvoidTolls(profile.user_id, !avoidTolls);
  }

  onAvoidMotorwayClicked(event) {
    const profile = this.props.profile;
    const avoidMotorways = this.state.avoidMotorWay;
    this.setState({avoidMotorWay : !avoidMotorways});
    firebaseDatabaseService.updateUserAvoidMotorway(profile.user_id, !avoidMotorways);
  }

  render() {
    const travelModeOptions = [
        { value: 'BICYCLING', label: 'BICYCLING' },
        { value: 'DRIVING', label: 'DRIVING' },
        { value: 'TRANSIT', label: 'TRANSIT' },
        { value: 'WALKING', label: 'WALKING' }
    ];
    const unitOptions = [
        { value: 'IMPERIAL', label: 'IMPERIAL' },
        { value: 'METRIC', label: 'METRIC' }
    ];

    return (
      <Jumbotron className="centerJumbo" >
        <h2>Preferences</h2>
        <div style={{ textAlign : 'left', width:'20%', marginLeft:'40%', marginRight:'40%'}}>
          <Checkbox checked={this.state.avoidMotorWay} onClick={this.onAvoidMotorwayClicked.bind(this)}>Avoid Motorways/HighWays</Checkbox>
          <Checkbox checked={this.state.avoidTolls} onClick={this.onAvoidTollsClicked.bind(this)}>Avoid Tolls</Checkbox>

          <ControlLabel>Travel Mode</ControlLabel>
          <Select
              name="travel_mode_select"
              value={this.state.travelModeOption}
              options={travelModeOptions}
              onChange={this.onTransportPreferenceSelected.bind(this)}
          />
          <br />

          <ControlLabel>Units</ControlLabel>
          <Select
              name="unit_select"
              value={this.state.unit}
              options={unitOptions}
              onChange={this.onUnitsSelected.bind(this)}
          />
        </div>
      </Jumbotron>
    )
  }
}

export default ProfileDetails;