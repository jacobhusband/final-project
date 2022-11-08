import React from 'react';

export default class Navbar extends React.Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-primary pl-2">
        <a className="navbar-brand" href="#">RunnerFuze</a>
        <a className='nav-item nav-link' href="#">{this.props.home}</a>
      </nav>
    );
  }
}
