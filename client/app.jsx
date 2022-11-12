import React from 'react';
import Splash from './pages/splash';
import parseRoute from './lib/parse-route';
import Run from './pages/run';
import Home from './pages/home';
import Photo from './pages/photo';
import Warning from './pages/warning';
import Stats from './pages/stats';
import Saved from './pages/saved';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
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
      return <Photo to="pre" />;
    } else if (route.path === 'warning') {
      return <Warning />;
    } else if (route.path === 'timer') {
      return <Run phase="timer" />;
    } else if (route.path === 'stats') {
      return <Stats />;
    } else if (route.path === 'postPhoto') {
      return <Photo to="post" />;
    } else if (route.path === 'saved') {
      return <Saved />;
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
