import React from 'react';
import {Tab, TabList} from './Tabs.js';
import Feed from './Feed.js';

const zipObject = (props, values) => {  
  return props.reduce((prev, prop, i) => {
    return Object.assign(prev, { [prop]: values[i] });
  }, {});
};

export default class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgs: {},
      self: []
    }
  }
  componentDidMount() {
    this.props.get('user/orgs')
    .then(orgs => {
        const urls = orgs.map(org => [org.login, `orgs/${org.login}/repos`]);
        const fork = urls.map(obj => {
            const [name, url] = obj;
            return this.props.get(url).then(data => {
              return [name, data]
            });
        });
        return Promise.all(fork);
    })
    .then(repos => {
        const keys = repos.map((r) => r[0]);
        const vals = repos.map((r) => r[1]);
        this.setState({
          orgs: zipObject(keys, vals)
        });
    });
    this.props.get('user/repos')
    .then(repos => {
      this.setState({
        self: repos
      });
    });    
  }
  render () {
    const selfTabs = this.state.self.map((selfRepo) => {
      return (
        <Tab name={selfRepo.name} key={selfRepo.name}>
          <Feed repo={selfRepo} get={this.props.get}/>
        </Tab>
      );
    });

    const orgTabs = Object.keys(this.state.orgs).map((org) => {
      const orgRepos = this.state.orgs[org].map((repo) => {
        return (
          <Tab name={repo.name} key={repo.name}>
            <Feed repo={repo} get={this.props.get}/>
          </Tab>
        )
      });

      return (
        <Tab name={org} key={org}>
          <TabList vertical key={org}>
            {orgRepos}
          </TabList>
        </Tab>
      );
    });

    return (
      <TabList horizontal>
        <Tab name="self" key="self">
          <TabList vertical key="self">
            {selfTabs}          
          </TabList>
        </Tab>
        {orgTabs}
      </TabList>
    );
  }
}