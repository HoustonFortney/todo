import React from 'react';
import Button from 'react-bootstrap/Button';

const Footer = () => (
  <div className="mt-auto d-flex justify-content-center">
    <Button variant="link" href="/terms">Terms</Button>
    <Button variant="link" href="/privacy">Privacy</Button>
    <Button variant="link" href="/cookies">Cookies</Button>
    <Button variant="link" href="/credits">Credits</Button>
  </div>
);

export default Footer;
