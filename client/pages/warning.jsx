import React from 'react';
import Navbar from '../components/navbar';

export default class Warning extends React.Component {

  render() {
    const ref = '#photo';

    return (
      <div className='text-center'>
        <Navbar home={this.props.home} />
        <p className='lh-lg h4 fw-bold mt-5 mx-auto col-8'>We highly recommend that you track your runs on a mobile device. The device must be on you while running.</p>
        <a href={ref} type="button" className='btn btn-primary mt-3'>Continue</a>
      </div>
    );
  }
}
