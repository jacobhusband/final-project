import React from 'react';
import Splash from './pages/splash';
import parseRoute from './lib/parse-route';
import Run from './pages/run';
import Home from './pages/home';
import Photo from './pages/photo';
import Warning from './pages/warning';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
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
    }
    if (route.path === 'run') {
      return <Run />;
    }
    if (route.path === 'home') {
      return <Home />;
    }
    if (route.path === 'photo') {
      return <Photo />;
    }
    if (route.path === 'warning') {
      return <Warning />;
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
