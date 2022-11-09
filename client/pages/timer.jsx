import React from 'react';
import Navbar from '../components/navbar';
import Message from '../components/message';
import Stopwatch from '../components/stopwatch';

export default class Timer extends React.Component {
  render() {
    const message = 'ready';

    return (
      <>
        <Navbar />
        <Message message={message} />
        <Stopwatch />
      </>
    );
  }
}
