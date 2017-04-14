import React, { Component } from 'react';
import {withGoogleMap, GoogleMap, DirectionsRenderer} from 'react-google-maps';
import CustomMarker from './CustomMarker';

class Map extends Component {

  handleMapClick(event) {
    console.log(event.latLng.lat() + ', ' + event.latLng.lng());
  }

  generateMapMarkers() {
    let mapMarkers = null;
    if(this.props.markers) {
      //console.log('Trying to render ' + this.props.markers.length  + ' markers');
      mapMarkers = this.props.markers.map((address, i) => {
          let marker={ };
          if(address !== undefined &&  address !== null) {
            marker={
                position : {
                   lat : address.lat,
                   lng : address.lng
                },
                address : {
                  formatted_address : address.formatted_address
                }
            };
          }
          return (
            <CustomMarker  marker={marker} key={i}/>
          )
      });      
    }
    return mapMarkers;
  }

  generateDirections() {
    // This is a bit messy and not very React but I couldn't figure out another way of doing this
    let rightPanel = document.getElementById("rightPanel");
    if(rightPanel) {
      rightPanel.innerHTML = "";
    }
    
    let directionsRender = null
    if(this.props.directions) {
      directionsRender =  (
        <DirectionsRenderer
            options={{draggable:false}}
            directions={this.props.directions}
            panel={rightPanel}
        />
        );
    }
    return directionsRender;
  }

  generateCentreLocation() {
    let centerLocation = this.props.center;
    if(!centerLocation) {
      centerLocation = { lat: 52.2373524, lng: -7.1071411 };
    }
    return centerLocation;
  }

  generateGoogleMap() {
    const centerLocation = this.generateCentreLocation();
    const mapMarkers = this.generateMapMarkers();
    const directionsRender = this.generateDirections();

    const GettingStartedGoogleMap = withGoogleMap(props => (
      <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={14}
        defaultCenter={{ lat: 52.2373524, lng: -7.1071411 }}
        center={centerLocation}
        yesIWantToUseGoogleMapApiInternals={true}
        onClick={this.handleMapClick}
        options={{streetViewControl:false, mapTypeControl : false, scrollwheel: true}}
      >
        { mapMarkers }
        { directionsRender }
      </GoogleMap>
    )); 
    return GettingStartedGoogleMap;   
  }

  // Generate the style of the panel that displays the directions
  generateRightPanelStyle() {
    let rightPanelStyle = {
      height : '0px',
      width : '0px'
    };
    if(this.generateDirections()) {
      rightPanelStyle= {
        lineHeight: '30px',
        paddingLeft: '10px',
        background : 'white',
        marginTop: '45px',
        height: 'calc(100% - 45px)',
        float: 'right',
        width: '35%',
        overflow: 'auto'
      }
    }
    return rightPanelStyle;  
  }

  render() {
    const rightPanelStyle = this.generateRightPanelStyle();
    const GettingStartedGoogleMap = this.generateGoogleMap();

    return (
      <div style={{ height: '100%', width: '100%' }}>
      <div id='rightPanel' style={rightPanelStyle}></div>
        <div style={{ height: '100%', width:'100%'}}>
            <GettingStartedGoogleMap
              containerElement={
                <div style={{ height: '100%' }} />
              }
              mapElement={
                <div style={{ height: '100%' }} />
              }
            />
        </div>
      </div>  
    );
  }
}

export default Map;