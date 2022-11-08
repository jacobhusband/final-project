import React from 'react';
import Splash from './pages/splash';

export default class App extends React.Component {

  componentDidMount() {
    window.addEventListener('hashchange', event => {

    });
  }

  render() {
    return <Splash home={this.props.home} run={this.props.run} />;
  }
}
