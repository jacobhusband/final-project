import React from 'react';
import Splash from './pages/splash';
import parseRoute from './lib/parse-route';
import Run from './pages/run';
import Home from './pages/home';
import Photo from './pages/photo';

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
      return <Splash home={this.props.home} run={this.props.run} />;
    }
    if (route.path === 'run') {
      return <Run home={this.props.home} />;
    }
    if (route.path === 'home') {
      return <Home home={this.props.home} />;
    }
    if (route.path === 'photo') {
      return <Photo home={this.props.home} flash={this.props.flash} picture={this.props.picture} swap={this.props.swap} check={this.props.check} retake={this.props.retake} />;
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
