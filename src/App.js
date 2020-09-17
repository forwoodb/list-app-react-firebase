import React, {Component} from 'react';
import Main from './Components/Main';
import {auth, provider} from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user.uid,
        })
      }
    });
  }

  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user: user.uid,
        })
      })
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null,
        });
      });
      window.location ="/"
  }

  render() {
    return (
      <div className="App">
        <Main
          user={this.state.user}
          login={this.login}
          logout={this.logout}
        />
      </div>
    );
  }
}

export default App;
