import React from 'react';

export default class Feed extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: []
    }
  }

  componentDidMount() {
    const name = this.props.repo.full_name;
    this.props.get(`repos/${name}/events`)
    .then(events => this.setState({events: events}));    
  }

  render() {
    const events = this.state.events.length ? this.state.events.map((e) => {
      return (
        <div className="event">{e.actor.login} {e.type} {e.payload.head}</div>
      );
    }) : (<h2>none</h2>);
    return (
      <div>
        {events}
      </div>
    );
  }
}
