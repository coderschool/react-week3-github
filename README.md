## Getting started

* Create the app
  ```
  create-react-app github
  cd github
  yarn start
  ```


* [Create a Github application](https://github.com/settings/applications/new). Make sure to set the callback URL to http://localhost:5000

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

Draw up a rough architecture diagram (pen and paper is fine) of how you want this to look like.

