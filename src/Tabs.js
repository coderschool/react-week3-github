import React from 'react';

export class TabList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selected: null
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.selected == null) {
      let defaultTab = React.Children.toArray(nextProps.children.map((child) => child.props.name))[0];

      React.Children.forEach(nextProps.children, (child) => {
        if (child.props.default) {
          defaultTab = child.props.name;
        }
      });

      this.setState({
        selected: defaultTab
      });
    }
  }

  select(item) {
    this.setState({
        selected: item
    });
  }  

  render() {
    const tabs = React.Children.map(this.props.children, (child) => {      
      const className = (child.props.name === this.state.selected) ? "selected" : "unselected";
      return (
        <h1 
          className={className}
          onClick={(e) => this.select(child.props.name)}>{child.props.name}</h1>
      );
    });
    let body;
    React.Children.forEach(this.props.children, (child) => {      
      if (child.props.name === this.state.selected) {
        body = child;
      }
    });
    return (
        <div className="holder">
            <div className="tabs">
            {tabs}
            </div>
            <div className="body">
            {body}
            </div>
        </div>
    );
  }
}

export class Tab extends React.Component {
  render () {
      return this.props.children;
  }  
}


