import React, { Component } from 'react';
import './App.css';
import {Tab, TabList} from './Tabs.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: []
    };
  }

  componentDidMount() {
    this.setState({
      tabs: ["a", "b", "c"]
    })
  }

  render() {
    const tabs = this.state.tabs.map((t) => (
      <Tab name={t} key={t}>
        <h1>Hello{t}</h1>
      </Tab>
    ));
    return (
      <TabList>
        {tabs}
      </TabList>
    );
  }
}

export default App;
