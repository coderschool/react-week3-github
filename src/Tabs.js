import React from 'react';

export class TabList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selected: 'a'
    };
  }

  render() {
    const tabs = React.Children.map(this.props.children, (child) => {      
      const className = (child.props.name === this.state.selected) ? "selected" : "unselected";
      return (
        <h1 className={className}>{child.props.name}</h1>
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


