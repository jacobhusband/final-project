import React from 'react';

export default class Message extends React.Component {
  render() {
    let text;

    if (this.props.message === 'warning') {
      text = 'We highly recommend that you track your runs on a mobile device. The device must be on you while running.';
    } else if (this.props.message === 'run') {
      text = "To track your run, don't turn off the screen. The screen should not go to sleep on its own.";
    } else if (this.props.message === 'ready') {
      text = 'Ready to go?';
    } else if (this.props.message === 'time') {
      text = 'Time';
    } else if (this.props.message === 'final') {
      text = 'Final Time';
    }

    return (
      <p className='lh-lg h4 fw-bold mt-5 mx-auto col-8 text-center'>
        {text}
      </p>
    );
  }
}
