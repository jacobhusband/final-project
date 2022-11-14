import React from 'react';
import Navbar from '../components/navbar';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      runData: null
    };
  }

  componentDidMount() {
    fetch(`/api/run/${this.props.runId}`).then(result => result.json()).then(runData => {
      this.setState({
        runData
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.runData) return;

    return (
      <Navbar />
    );
  }
}
