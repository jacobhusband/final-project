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
import redirect from './lib/redirect';
import AppContext from './lib/app-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      preImageUrl: null,
      postImageUrl: null,
      runId: null,
      postId: null,
      userLogin: null,
      checkedForLogin: false,
      signedOut: false,
      infoIncorrect: false
    };
    this.savePreImage = this.savePreImage.bind(this);
    this.savePostImage = this.savePostImage.bind(this);
    this.resetSavedImages = this.resetSavedImages.bind(this);
    this.saveRunId = this.saveRunId.bind(this);
    this.savePostId = this.savePostId.bind(this);
    this.updateUserLogin = this.updateUserLogin.bind(this);
    this.resetUserLogin = this.resetUserLogin.bind(this);
    this.checkForLogin = this.checkForLogin.bind(this);
  }

  updateUserLogin(userLogin) {
    this.setState({
      userLogin
    }, () => {
      localStorage.setItem('userLogin', JSON.stringify(userLogin));
      if (this.state.userLogin === null) {
        this.setState({
          infoIncorrect: true
        });
      } else {
        this.setState({
          infoIncorrect: false
        });
      }
    });
  }

  resetUserLogin() {
    const route = Object.assign({}, this.state.route);
    route.path = '';
    redirect({ to: '' });
    localStorage.setItem('userLogin', null);
    this.setState({
      userLogin: null,
      checkedForLogin: false,
      signedOut: true,
      route
    });
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

  savePostId(postId) {
    this.setState({
      postId
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
    this.checkForLogin();
  }

  checkForLogin() {
    this.setState({
      userLogin: JSON.parse(localStorage.getItem('userLogin')),
      checkedForLogin: true,
      signedOut: false
    });
  }

  componentDidUpdate() {
    if (this.state.signedOut) {
      this.checkForLogin();
    }
  }

  renderPage() {
    if (!this.state.checkedForLogin) return;

    const message = (this.state.infoIncorrect)
      ? (
        <p className='text-center text-light'>The information entered was incorrect</p>
        )
      : (
          null
        );

    const { route } = this.state;
    if (route.path === '') {
      return <Splash updateUserLogin={this.updateUserLogin} userLogin={this.state.userLogin} message={message} />;
    } else if (route.path === 'run') {
      return <Run phase="preImage" />;
    } else if (route.path === 'home') {
      return <Home login={this.state.userLogin} saveRunId={this.saveRunId} savePostId={this.savePostId} />;
    } else if (route.path === 'prePhoto') {
      return <Photo to="pre" savePreImage={this.savePreImage} preImageUrl={this.state.preImageUrl} token={this.state.userLogin.token} />;
    } else if (route.path === 'warning') {
      return <Warning />;
    } else if (route.path === 'timer') {
      return <Run phase="timer" />;
    } else if (route.path === 'stats') {
      return <Stats saveRunId={this.saveRunId} preImageUrl={this.state.preImageUrl} postImageUrl={this.state.postImageUrl} login={this.state.userLogin} />;
    } else if (route.path === 'postPhoto') {
      return <Photo to="post" savePostImage={this.savePostImage} postImageUrl={this.state.postImageUrl} token={this.state.userLogin.token} />;
    } else if (route.path === 'saved') {
      return <Saved saveRunId={this.saveRunId} resetSavedImages={this.resetSavedImages} login={this.state.userLogin} />;
    } else if (route.path === 'post') {
      return <Post runId={this.state.runId} login={this.state.userLogin} />;
    } else if (route.path === 'edit') {
      return <Post runId={this.state.runId} postId={this.state.postId} login={this.state.userLogin} edit="true" />;
    }
  }

  render() {
    return (
      <AppContext.Provider value={this.resetUserLogin}>
        {this.renderPage()}
      </AppContext.Provider>
    );
  }
}
