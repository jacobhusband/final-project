import React from 'react';
import Splash from './pages/splash';
import parseRoute from './lib/parse-route';
import Run from './pages/run';
import Home from './pages/home';
import Photo from './pages/photo';
import Warning from './pages/warning';
import Stats from './pages/stats';
import Saved from './pages/saved';
import Post from './pages/post';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      preImageUrl: null,
      postImageUrl: null,
      runId: null,
      postInfo: {
        beforeImageUrlOrder: 1,
        routeImageUrlOrder: 2,
        afterImageUrlOrder: 3,
        beforeImageUrlShowing: true,
        routeImageUrlShowing: true,
        afterImageUrlShowing: true
      }
    };
    this.savePreImage = this.savePreImage.bind(this);
    this.savePostImage = this.savePostImage.bind(this);
    this.resetSavedImages = this.resetSavedImages.bind(this);
    this.saveRunId = this.saveRunId.bind(this);
    this.updatePostInfo = this.updatePostInfo.bind(this);
  }

  savePreImage(preImageUrl) {
    this.setState({
      preImageUrl
    });
  }

  savePostImage(postImageUrl) {
    this.setState({
      postImageUrl
    });
  }

  saveRunId(runId) {
    this.setState({
      runId
    });
  }

  updatePostInfo(postInfo) {
    this.setState({
      postInfo
    });
  }

  resetSavedImages() {
    this.setState({
      preImageUrl: null,
      postImageUrl: null
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in window.navigator) {
      try {
        window.navigator.serviceWorker.register('sw.js')
          .then(registration => { })
          .catch(err => console.error(err));
      } catch (err) {
        console.error(err);
      }
    }
  }

  componentDidMount() {
    this.registerServiceWorker();
    window.addEventListener('hashchange', event => {
      const route = parseRoute(window.location.hash);
      this.setState({
        route
      });
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Splash />;
    } else if (route.path === 'run') {
      return <Run phase="preImage" />;
    } else if (route.path === 'home') {
      return <Home />;
    } else if (route.path === 'prePhoto') {
      return <Photo to="pre" savePreImage={this.savePreImage} preImageUrl={this.state.preImageUrl} />;
    } else if (route.path === 'warning') {
      return <Warning />;
    } else if (route.path === 'timer') {
      return <Run phase="timer" />;
    } else if (route.path === 'stats') {
      return <Stats saveRunId={this.saveRunId} preImageUrl={this.state.preImageUrl} postImageUrl={this.state.postImageUrl} />;
    } else if (route.path === 'postPhoto') {
      return <Photo to="post" savePostImage={this.savePostImage} postImageUrl={this.state.postImageUrl} />;
    } else if (route.path === 'saved') {
      return <Saved saveRunId={this.saveRunId} resetSavedImages={this.resetSavedImages} />;
    } else if (route.path === 'post') {
      return <Post runId={this.state.runId} postInfo={this.state.postInfo} updatePostInfo={this.updatePostInfo} />;
    }
  }

  render() {
    return (
      <>
        {this.renderPage()}
      </>
    );
  }
}
