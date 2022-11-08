import React from 'react';
import Navbar from '../components/navbar';

export default class Run extends React.Component {

  render() {
    return (
      <Navbar home={this.props.home} />
    );
  }
}
