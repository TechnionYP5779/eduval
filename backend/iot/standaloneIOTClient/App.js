import React from 'react';
import logo from './logo.svg';
import './App.css';

const notifications = require('./Notifications')

//Just so the messages change
let counter = 0

function App() {
	notifications.connect().then(() => {
		notifications.client.subscribe('someTopic');
		notifications.client.publish('someTopic', 'saying stuff ' + counter++);
		notifications.client.on('message', (topic, message) => {
			console.log("topic: " + topic)
			console.log("message: " + message)
			notifications.client.publish('someTopic', 'saying stuff ' + counter++);
		})
	})
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
