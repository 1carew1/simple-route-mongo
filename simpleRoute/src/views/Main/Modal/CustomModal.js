import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';


class CustomModal extends Component {

  render() {
  	return (
	    	<Modal show={this.props.showModal} onHide={this.props.closeModal} style={{marginTop:'120px'}}>
	          <Modal.Header closeButton>
	          	{this.props.modalName}
	          </Modal.Header>
	          <Modal.Body >
	          	{this.props.modalBody}
	          </Modal.Body>
	        </Modal>
  	);
  }
}

export default CustomModal;