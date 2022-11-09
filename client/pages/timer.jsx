import React from 'react';
import Navbar from '../components/navbar';
import Stopwatch from '../components/stopwatch';

export default class Timer extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <Stopwatch />
      </>
    );
  }
}
