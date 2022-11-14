import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBookmark } from '@fortawesome/free-solid-svg-icons';

export default class NavbarItem extends React.Component {

  render() {
    const home = <FontAwesomeIcon icon={faHome} />;
    const bookmark = <FontAwesomeIcon icon={faBookmark} />;

    return (
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">RunnerFuze</Navbar.Brand>
          <a className='left-nav nav-item nav-link' href="#saved">{bookmark}</a>
          <a className='nav-item nav-link' href="#home">{home}</a>
        </Container>
      </Navbar>
    );
  }
}
