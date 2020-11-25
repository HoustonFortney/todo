import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react';

const ConfirmationModal = (props) => (
  <Modal show={props.show} onHide={props.onHide} centered>
    <Modal.Header>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{props.message}</Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={props.onCancel}>
        Cancel
      </Button>
      <Button variant="danger" onClick={props.onConfirm}>
        <i className="far fa-trash-alt" />
        <>&nbsp;Delete</>
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmationModal;
