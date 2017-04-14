import React, {Component} from 'react'
import { Nav, Navbar, NavDropdown, MenuItem, NavItem} from 'react-bootstrap';
import {browserHistory} from 'react-router';
import FlyToLocationForm from '../GoogleMaps/FlyToLocationForm';
import DirectionsForm from '../GoogleMaps/DirectionsForm';
import CustomModal from '../Modal/CustomModal';
import {LinkContainer} from 'react-router-bootstrap';

// create classes
let modalBody = null;

class CustomNavbar extends Component {

  constructor() {
  	super();
    this.state = { showModal: false, modalName : '' };
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  openFlyToModal() {
  	modalBody = (
		<FlyToLocationForm centerLocation={this.centerMapUsingLatLng.bind(this)} closeModal={this.closeModal.bind(this)}/>
	);
	this.setState({ modalName: 'Fly to Location' });
    this.openModal();
  }

  openDirectionsModal() {
  	modalBody = (
		<DirectionsForm closeModal={this.closeModal.bind(this)} map={this.props.map} setDirectionsOnMap={this.props.setDirectionsOnMap} />
	);
	this.setState({ modalName: 'Directions' });
  	this.openModal();
  }

  openModal() {
  	this.setState({ showModal: true });
  }

  centerMapUsingLatLng(location) {
  	this.props.centerLocation(location);
  }

  centerMap() {
  	browserHistory.push('/home');
	const location = JSON.parse(localStorage.getItem('currentLocation') || '{}');
	if(location) {
	   this.centerMapUsingLatLng(location);
	}
  }

  generateNavigationOptions() {
  	// set data
  	let mapOptionsDisabled = this.props.disableMapOptions;

	let myNavBarData = {};
	myNavBarData.brand =  {linkTo: "#", text: "Simple Route"};
	myNavBarData.links = [
	  {linkTo: "/home", text: "Home"},
	  {linkTo: "/profile", text: "Profile"},
	  {linkTo: "/about", text: "About"},
	  {linkTo: "/logout", text: "Logout"},
	  {disabled:mapOptionsDisabled, dropdown: true, text: "Map Options", links: [
	    {text: "Centre Map", onClick: this.centerMap.bind(this)},
	    {text: "Fly to Location", onClick: this.openFlyToModal.bind(this)},
	    {text: "Get Directions", onClick: this.openDirectionsModal.bind(this)}
	  ]}
	];
	return myNavBarData;  	
  }

  generateNavigationItems() {
  	let myNavBarData = this.generateNavigationOptions();
  	let navItems = null;
	if(myNavBarData.links) {
		navItems = myNavBarData.links.map((link, i) => {
			let linkItem = null;
			if(!link.dropdown) {
				linkItem = (
					  <LinkContainer key={i} to={link.linkTo}>
  						 <NavItem  eventKey={i} active={link.active} onClick={link.onClick}>{link.text}</NavItem>
  						</LinkContainer>
					
				);
			} else {	
				//Its a DropDown Item
				let dropDownItems = null;
				dropDownItems = link.links.map((dropdownlink, j) => {
					if(dropdownlink.linkTo) {
						return (
							<LinkContainer key={j} to={dropdownlink.linkTo}>
								<MenuItem key={j} eventKey={i + '.' + j} active={dropdownlink.active} onClick={dropdownlink.onClick}>{dropdownlink.text}</MenuItem>
							</LinkContainer>
						);
					} else {
						return (
								<MenuItem key={j} eventKey={i + '.' + j} active={dropdownlink.active} onClick={dropdownlink.onClick}>{dropdownlink.text}</MenuItem>
						);
					}

				}, i);
				linkItem = (
					 <NavDropdown key={i}  eventKey={i} title={link.text} id="basic-nav-dropdown" disabled={link.disabled}>
					 {dropDownItems}
					 </NavDropdown>
				);
			}
			return linkItem;
		})
	}
	return navItems;
  }

  render() {
  	const navItems = this.generateNavigationItems();
    return(
    	<div>
    	  <CustomModal showModal={this.state.showModal} closeModal={this.closeModal.bind(this)} modalName={this.state.modalName} modalBody={modalBody}/>
		  <Navbar fluid inverse fixedTop collapseOnSelect>
		    <Navbar.Header>
		      <Navbar.Brand>
		        Simple Route
		      </Navbar.Brand>
		      <Navbar.Toggle />
		    </Navbar.Header>
		    <Navbar.Collapse>
		      <Nav>
		      	{navItems}
		      </Nav>
		    </Navbar.Collapse>
		  </Navbar>
		</div>
	);
  }
}

export default CustomNavbar;