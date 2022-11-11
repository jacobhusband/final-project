import React from 'react';
import Navbar from '../components/navbar';
import Message from '../components/message';
import Tracker from '../components/tracker';

export default class Run extends React.Component {

  render() {
    let content;

    const message = "To track your run, don't turn off the screen. The screen should not go to sleep on its own.";

    if (this.props.phase === 'preImage') {
      let ref;
      if (window.innerWidth > 600) {
        ref = '#warning';
      } else {
        ref = '#prePhoto';
      }
      content = <>
        <Message>
          {message}
        </Message>
        <a href={ref} type="button" className='btn btn-primary mt-3'>Continue</a>
      </>;
    } else if (this.props.phase === 'timer') {
      content = <Tracker />;
    }

    return (
      <div className='text-center'>
        <Navbar />
        {content}
      </div>
    );
  }
}
