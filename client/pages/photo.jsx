import React from 'react';
import Navbar from '../components/navbar';

export default class Photo extends React.Component {

  render() {
    return (
      <div className='text-center'>
        <Navbar home={this.props.home} />
        <p className='lh-lg h4 fw-bold mt-5'>Take a pre-exercise photo</p>
        <div className='camera-container' />
      </div>
    );
  }
}
