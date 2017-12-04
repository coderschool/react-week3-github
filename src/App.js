import React, { Component } from 'react';
import './App.css';
import {withGithub} from './GithubApi.js';
import Homepage from './Homepage.js';

class App extends Component {
  render() {
    const WrappedHomePage = withGithub(Homepage, clientId);
    return (
      <WrappedHomePage />
    );
  }
}

export default App;
