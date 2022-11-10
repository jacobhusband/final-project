import React from 'react';
import Navbar from '../components/navbar';
import Message from '../components/message';
import Tracker from '../components/tracker';

export default class Run extends React.Component {

  render() {
    let ref, content;
    if (window.innerWidth > 600) {
      ref = '#warning';
    } else {
      ref = '#photo';
    }

    if (this.props.phase === 'preImage') {
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
