import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../static/images/Logo.svg';

const Footer = () => (
  <div className="labs-footer bg-black">
    <Logo width={135} height={32} />
    <Link to="/privacy-policy">Privacy Policy</Link>
  </div>
);

export default Footer;
