import React from 'react';
import Button from 'react-bootstrap/Button';

export default class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }

  render() {

    return (
      <>
        <div className='stopwatch d-flex justify-content-center align-items-center mx-auto border border-3 border-primary rounded-circle'>
          <p className='h1 text-primary'>{this.state.time}</p>
        </div>
        <div className="d-flex justify-content-center mt-3 gap-2">
          <Button>Start</Button>
          <Button>Stop</Button>
        </div>
      </>
    );
  }
}
