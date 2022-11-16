import React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPersonRunning } from '@fortawesome/free-solid-svg-icons';

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phase: 'nonUser'
    };
    this.showSignUpModal = this.showSignUpModal.bind(this);
  }

  showSignUpModal() {

  }

  render() {
    let content;
    const home = <FontAwesomeIcon icon={faHome} />;
    const run = <FontAwesomeIcon icon={faPersonRunning} />;
    if (this.state.phase === 'nonUser') {
      content = (
        <div>
          <Button onClick={this.showSignUpModal} variant="primary" type="button">Sign Up</Button>
        </div>
      );
    } else if (this.state.phase === 'user') {
      content = (
        <div>
          <Button variant="primary" href='#home' type="button">Home {home}</Button>
          <Button variant="primary" href='#run' type="button">Go Run {run}</Button>
        </div>
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
