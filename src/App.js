import React, { Component } from 'react';
import './App.css';
import {Tab, TabList} from './Tabs.js';

class App extends Component {
  render() {
    return (
      <TabList>
          <Tab name="a">
              <h1>HelloA</h1>
          </Tab>
          <Tab name="b">
              <h1>HelloB</h1>
          </Tab>
          <Tab name="c">
              <h1>HelloC</h1>                
          </Tab>
      </TabList>
    );
  }
}

export default App;
