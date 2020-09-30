import React, {Component} from 'react';
import firebase from '../firebase.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import NavBar from './NavBar.js';
import ListItems from './ListItems.js';
import Collection from './Collection.js';

export default class Main extends Component {
  constructor() {
    super()
    this.state = {
      lists: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteList = this.deleteList.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const newList = {
      list: e.target.elements.text.value,
      edit: false,
      user: this.props.user ? this.props.user : 'demo',
    }
    this.setState({
      lists: this.state.lists.concat(newList),
    })
    firebase.database().ref('lists').push(newList)
  }

  componentDidMount() {
    firebase.database().ref('lists').on('value', (snapshot) => {
      // console.log(snapshot.val());

      let collection = [];

      let user;
      if (this.props.user) {
        user = this.props.user;
      } else {
        user = 'demo';
      }

      // snapshot.forEach((list) => {
      //   list.push(list.val())
      // });

      // Alternatively:
      let data = snapshot.val();
      for (let list in data) {
        if (data[list].user === user) {
          collection.push({
            id: list,
            list: data[list].list,
            edit: data[list].edit,
            user: data[list].user,
          })
        }
      }

      this.setState({
        lists: collection,
      })
    });
  }

  deleteList(delList) {
    console.log(delList);
    firebase.database().ref('lists/' + delList).remove();
  }

  viewList(vList) {
    // console.log(vList);
    this.setState({
      lists: this.state.lists.map((list) => {
        if (list.id === vList) {
          list.edit = !list.edit
          // console.log(list);

        }
        return list;
      })
    })
  }

  handleUpdateChange(e) {
    this.setState({
      list: e.target.value
    })

  }

  updateList(uList) {
    console.log(uList);
    this.setState({
      lists: this.state.lists.map((list) => {
        if (list.id === uList) {
          list.edit = !list.edit
          console.log(list);

        }
        return list;
      })
    })
  }

  render() {
    return (
      <div className="container">
        <Router>
          <NavBar
            user={this.props.user}
            login={this.props.login}
            logout={this.props.logout}
          />
          <Route exact path="/">
            <Collection lists={this.state.lists}/>
          </Route>
          <Route path={'/View/:id'} exact component={ListItems}/>
        </Router>
      </div>
    );
  }
}