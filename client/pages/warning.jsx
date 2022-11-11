import React from 'react';
import Navbar from '../components/navbar';
import Message from '../components/message';

export default class Warning extends React.Component {

  render() {
    const message = 'We highly recommend that you track your runs on a mobile device. The device must be on you while running.';

    return (
      <div className='text-center'>
        <Navbar />
        <Message>
          {message}
        </Message>
        <a href='#prePhoto' type="button" className='btn btn-primary mt-3'>Continue</a>
      </div>
    );
  }
}
