import React from 'react';
import Navbar from '../components/navbar';
import Message from '../components/message';
import Tracker from '../components/tracker';

export default class Run extends React.Component {

  render() {
    let content;

    if (this.props.phase === 'preImage') {
      let ref;
      if (window.innerWidth > 600) {
        ref = '#warning';
      } else {
        ref = '#prePhoto';
      }
      content = <>
        <Message message="run" />
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
