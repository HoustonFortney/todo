import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react';

const ConfirmationModal = (props) => {
  const {
    show, title, message, onHide, onCancel, onConfirm,
  } = props;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          <i className="far fa-trash-alt" />
          {'\xA0Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
