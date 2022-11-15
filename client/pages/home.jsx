import React from 'react';
import Navbar from '../components/navbar';
import RunInfo from '../components/runInfo';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: null
    };
  }

  componentDidMount() {
    fetch('/api/posts').then(result => result.json()).then(postData => {
      this.setState({
        postData
      });
    }).catch(err => console.error(err));
  }

  render() {
    if (!this.state.postData) return;

    const posts = this.state.postData.map(postData => {
      return <RunInfo key={postData.postId} postData={postData} />;
    });

    return (
      <div className="home-page">
        <Navbar />
        {posts}
      </div>
    );
  }
}
