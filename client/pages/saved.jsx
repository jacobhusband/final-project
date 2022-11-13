import React from 'react';
import Navbar from '../components/navbar';

export default class Saved extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedSavedRuns: false
    };
  }

  componentDidMount() {
    fetch('/api/runs').then(result => result.json()).then(runObj => {
      this.setState({
        receivedSavedRuns: runObj
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.receivedSavedRuns) return;

    return (
      <div>
        <Navbar />
      </div>
    );
  }
}
