import React from 'react';
import Navbar from '../components/navbar';
import Message from '../components/message';

export default class Warning extends React.Component {

  render() {

    return (
      <div className='text-center'>
        <Navbar />
        <Message message="warning" />
        <a href='#photo' type="button" className='btn btn-primary mt-3'>Continue</a>
      </div>
    );
  }
}
