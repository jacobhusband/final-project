import React from 'react';
import Button from 'react-bootstrap/Button';

export default class Splash extends React.Component {

  render() {
    return (
      <div className='background-container'>
        <div className='radial-gradient-overlay'>
          <h1>RunnerFuze</h1>
          <div className='buttons d-flex flex-column mx-auto mt-5 gap-3'>
            <Button variant="primary" href='#home' type="button">Home {this.props.home}</Button>
            <Button variant="primary" href='#run' type="button">Go Run {this.props.run}</Button>
          </div>
        </div>
      </div>
    );
  }
}
