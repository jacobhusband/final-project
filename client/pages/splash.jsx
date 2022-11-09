import React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPersonRunning } from '@fortawesome/free-solid-svg-icons';

export default class Splash extends React.Component {

  render() {
    const home = <FontAwesomeIcon icon={faHome} />;
    const run = <FontAwesomeIcon icon={faPersonRunning} />;

    return (
      <div className='background-container'>
        <div className='radial-gradient-overlay'>
          <h1 className='text-light text-center mt-5 fw-bold'>RunnerFuze</h1>
          <div className='buttons d-flex flex-column mx-auto mt-5 gap-3'>
            <Button variant="primary" href='#home' type="button">Home {home}</Button>
            <Button variant="primary" href='#run' type="button">Go Run {run}</Button>
          </div>
        </div>
      </div>
    );
  }
}
