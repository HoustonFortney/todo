import React from 'react';
import Button from 'react-bootstrap/Button';

const Footer = () => (
  <div className="fixed-bottom d-flex justify-content-center">
    <Button variant="link" href="/terms">Terms</Button>
    <Button variant="link" href="/privacy">Privacy Policy</Button>
    <Button variant="link" href="/cookies">Cookies</Button>
  </div>
);

export default Footer;
