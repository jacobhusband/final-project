import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default class NavbarItem extends React.Component {

  render() {
    const home = <FontAwesomeIcon icon={faHome} />;

    return (
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">RunnerFuze</Navbar.Brand>
          <a className='nav-item nav-link' href="#">{home}</a>
        </Container>
      </Navbar>
    );
  }
}
