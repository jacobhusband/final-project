import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

export default class NavbarItem extends React.Component {

  render() {
    return (
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">RunnerFuze</Navbar.Brand>
          <a className='nav-item nav-link' href="#">{this.props.home}</a>
        </Container>
      </Navbar>
    );
  }
}
