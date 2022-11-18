import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBookmark, faSignOut, faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import AppContext from '../lib/app-context';

export default class NavbarItem extends React.Component {

  render() {
    const home = <FontAwesomeIcon icon={faHome} />;
    const bookmark = <FontAwesomeIcon icon={faBookmark} />;
    const signOut = <FontAwesomeIcon icon={faSignOut} />;
    const runner = <FontAwesomeIcon icon={faPersonRunning} />;

    return (
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">RunnerFuze</Navbar.Brand>
          <a className='pe-4 me-2 left-nav nav-item nav-link' href="#home">{home}</a>
          <a className='pe-4 me-1 nav-item nav-link' href="#saved">{bookmark}</a>
          <a className='pe-4 nav-item nav-link' href="#run">{runner}</a>
          <Button className='nav-item nav-link' onClick={this.context}>{signOut}</Button>
        </Container>
      </Navbar>
    );
  }
}

NavbarItem.contextType = AppContext;
