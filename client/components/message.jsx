import React from 'react';

export default class Message extends React.Component {
  render() {
    return (
      <p className='lh-lg h4 fw-bold mt-5 mx-auto col-8 text-center'>
        {this.props.children}
      </p>
    );
  }
}
