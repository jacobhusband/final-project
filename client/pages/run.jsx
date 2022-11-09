import React from 'react';
import Navbar from '../components/navbar';
import Message from '../components/message';

export default class Run extends React.Component {

  render() {
    let ref;
    if (window.innerWidth > 600) {
      ref = '#warning';
    } else {
      ref = '#photo';
    }

    return (
      <div className='text-center'>
        <Navbar />
        <Message message="run" />
        <a href={ref} type="button" className='btn btn-primary mt-3'>Continue</a>
      </div>
    );
  }
}
