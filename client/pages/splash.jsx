import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPersonRunning } from '@fortawesome/free-solid-svg-icons';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: 'nonUser',
      modal: false,
      user: null
    };
    this.switchModal = this.switchModal.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  registerUser(event) {
    event.preventDefault();
    const { username, password } = event.target.elements;
    const info = { username: username.value, password: password.value };
    const details = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    };
    fetch('/api/auth/sign-up', details).then(res => res.json()).then(user => {
      this.setState({
        user,
        modal: false
      });
    }).catch(err => console.error(err));
  }

  switchModal() {
    if (this.state.modal) {
      this.setState({
        modal: false
      });
    } else {
      this.setState({
        modal: true
      });
    }
  }

  render() {
    let content;
    const home = <FontAwesomeIcon icon={faHome} />;
    const run = <FontAwesomeIcon icon={faPersonRunning} />;
    if (this.state.phase === 'nonUser') {
      content = (
        <>
          <Button variant="primary" onClick={this.switchModal}>
            Sign Up
          </Button>

          <UserModal
            show={this.state.modal}
            onHide={this.switchModal}
            onSubmit={this.registerUser}
          />
        </>
      );
    } else if (this.state.phase === 'user') {
      content = (
        <>
          <Button variant="primary" href='#home' type="button">Home {home}</Button>
          <Button variant="primary" href='#run' type="button">Go Run {run}</Button>
        </>
      );
    }

    return (
      <div className='background-container'>
        <div className='radial-gradient-overlay'>
          <h1 className='text-light text-center mt-5 fw-bold'>RunnerFuze</h1>
          <div className='buttons d-flex flex-column mx-auto mt-5 gap-3'>
            {content}
          </div>
        </div>
      </div>
    );
  }
}

function UserModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Sign Up
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" autoComplete="new-username" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" autoComplete="new-password" />
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button onSubmit={props.onSubmit} variant="primary" type="submit">
            Register
          </Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
