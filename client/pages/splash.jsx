import React from 'react';

export default class Splash extends React.Component {

  render() {
    return (
      <div className='background-container'>
        <div className='radial-gradient-overlay'>
          <h1>RunnerFuze</h1>
          <div className='buttons d-flex flex-column mx-auto mt-5'>
            <a href='#home' type="button" className='btn btn-primary mb-3'>Home {this.props.home}</a>
            <a href='#run' type="button" className='btn btn-primary'>Go Run {this.props.run}</a>
          </div>
        </div>
      </div>
    );
  }
}
