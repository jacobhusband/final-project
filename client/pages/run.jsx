import React from 'react';
import Navbar from '../components/navbar';

export default class Run extends React.Component {

  render() {
    return (
      <div className='text-center'>
        <Navbar home={this.props.home} />
        <p className='lh-lg h4 fw-bold mt-5 mx-auto col-8'>To track your run, don&apos;t turn off the screen. The screen should not go to sleep on its own.</p>
        <a href='#photo' type="button" className='btn btn-primary mt-3'>Continue</a>
      </div>
    );
  }
}
