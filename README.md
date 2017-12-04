## Getting started

* Create the app
  ```
  create-react-app github
  cd github
  yarn start
  ```


* [Create a Github application](https://github.com/settings/applications/new). Make sure to set the callback URL to http://localhost:5000

* Add your `clientId` and `secretKey` to the server.js in THIS REPO.

* From this repo, start up the OAuth server.
  ```
  node server.js
  ```


## Milestone 0: Architecture diagram

We want to build a tabbed Github activity browser.

<img src="./images/proto.png" width="300px"/>

The horizontal tabs at the top are your username and the organizations you are a part of.

When you click on one of these items, we will display a vertical tab list of the repositories belonging to the user or organization.

When you click on one of the repositories, we will display the activity stream for that repository.

Here are the GitHub API calls that are relevant for our problem:
* https://developer.github.com/v3/orgs/
* https://developer.github.com/v3/repos/
* https://developer.github.com/v3/activity/events/

Draw up a rough architecture diagram (pen and paper is fine) of how you want to structure this app.

## Milestone 1: Create tabs.

<img src="./images/proto.png" width="300px"/>

We're doing something a bit different from the lecture in that we want to build both horizontal and vertical tabs and we want to nest them.

This is a library and when we build a library, we want to first start with the code that uses the library.

Start with an `App.js` that renders this:
```JSX
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
```

We want this to look like:
<img src="./images/ScreenM1f.png" width="300px"/>

So let's create a `Tabs.js` that will contain both our `TabList` and `Tab` component.

For `TabList`, specify a wrapper like we did during lecture.

```JSX
const tabs = null;
const body = null;
return (
    <div className="holder">
        <div className="tabs">
        {tabs}
        </div>
        <div className="body">
        {body}
        </div>
    </div>
)
```

And let's add some styles to `App.css`

```CSS
.holder {
  display: flex;
  flex-direction: row;
}
.tabs {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}
.body {
  margin-left: 100px;  
}
```

Let's start filling in tabs.

```JSX
const tabs = React.Children.map(this.props.children, (child) => {      
return (
  <h1>{child.props.name}</h1>
);
});
```

We also want to be able to highlight a selected tab

```JSX
constructor(props) {
  super(props);
  this.state = {
      selected: 'a'
  };
}
```

```JSX
const className = (child.props.name === this.state.selected) ? "selected" : "unselected";

return (
  <h1 className={className}>{child.props.name}</h1>
);
```

```CSS
.selected {
  color: red;
}
.unselected {
  color: blue;
}
```

Let's now fill in the body

```JSX
let body;
React.Children.forEach(this.props.children, (child) => {      
  if (child.props.name === this.state.selected) {
    body = child;
  }
});
```

This should error out because it's trying to render `<Tab>` and fails to do so. We need to define our `Tab` component, which simply delegates rendering to its children.

```JSX
export class Tab extends Component {
  render () {
      return this.props.children;
  }
}
```

<img src="./images/ScreenM1a.png" width="300px"/>

Now we can enable selection for the tabs.

```JSX
<h1
  ...
  onClick={(e) => this.select(child.props.name)}>
```

```JSX
select(item) {
  this.setState({
      selected: item
  });
}
```

We also want to add defaulting for the tabs because we can't just directly specify `this.state.selected` as we will be using `TabList` as a library.

```JSX
constructor(props) {
  super(props);
  this.state = {
    selected: null
  };
}
```

```
componentDidMount() {
  if (this.state.selected == null) {
    let defaultTab = React.Children.toArray(this.props.children.map((child) => child.props.name))[0];

    React.Children.forEach(this.props.children, (child) => {
      if (child.props.default) {
        defaultTab = child.props.name;
      }
    });

    this.setState({
      selected: defaultTab
    });
  }
}
```

Try setting Tab b to default.

<img src="./images/ScreenM1b.png" width="300px"/>

One thing we didn't discuss in lecture is what happens when the children are dynamic.

Let's modify our App.js a little. Suppose we need to load via AJAX what tabs we should show.

```JSX
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
```

This screws things up a bit.

<img src="./images/ScreenM1c.png" width="300px"/>

This is because if we only select the default tab at `componentDidMount`, we will have no data. Try adding a `console.log` to see this. Instead what we need to do is *ADD* `componentWillReceiveProps`. This is a function called whenever props are updated. It is not called with initial props, however.

```JSX
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
```

This function will be called twice, once with no `Tab` components and the second time with three `Tab` components.

<img src="./images/ScreenM1d.png" width="300px"/>

Now let's get a little wild. Let's change our App.js to render a nested list.
```JSX
componentDidMount() {
  this.setState({
    tabs: [
      ["a", ["A1", "A2", "A3"]],
      ["b", ["B1", "B2", "B3"]],
      ["c", ["C1", "C2", "c3"]]
    ]
  })
}

render() {
  const tabs = this.state.tabs.map((t) => {
    const [k, h] = t;
    const inner = h.map((k2) => {
      return (<Tab name={k2} key={k2}>
        <h1>{k2}</h1>
      </Tab>);
    });
    return (
      <Tab name={k} key={k}>
        <TabList vertical key={k}>
          {inner}
        </TabList>
      </Tab>
    );
  });

  return (
    <TabList horizontal key="root">
      {tabs}
    </TabList>
  );
}
```

These are nested TabLists and we want one to be horizontal and one to be vertical. Unfortunately, right now it looks something like this:

<img src="./images/ScreenM1e.png" width="300px"/>

* How do we make them horizontal? Well we need to flip the flex-box direction from row to column and vice versa. Our original:


```CSS
.holder {
  display: flex;
}
.tabs {
  display: flex;  
}
```
```CSS
.holder.vertical {
  flex-direction: row;
}
.tabs.vertical {
  margin-left: 10px;
  flex-direction: column;
}
.body.vertical {
  margin-left: 100px;
}
```
```CSS
.holder.horizontal {
  flex-direction: column;
}
.tabs.horizontal {
  flex-direction: row;
}
.tabs.horizontal h1 {
  margin-right: 100px;
}
```

And then we will set the direction in `Tabs.js`;

```JSX
  const direction = this.props.horizontal ? "horizontal" : "vertical";
  return (
      <div className={`holder ${direction}`}>
          <div className={`tabs ${direction}`}>
          {tabs}
          </div>
          <div className={`body ${direction}`}>
          {body}
          </div>
      </div>
  );
```

This still looks pretty ugly and nothing like our spec so let's fix up `App.css`.

```CSS
.holder {
  display: flex;
  background: #bbb;
}
.selected {
  color: #13f;
}
.unselected {
  color: #fff;
}
.tabs-horizontal {
  flex-direction: row;
  margin-left: auto;
}
```

Ehh close enough.

<img src="./images/ScreenM1f.png" width="300px"/>

