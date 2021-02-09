import React, {Component} from 'react';
import firebase from '../firebase.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import NavBar from './NavBar.js';
import ListItems from './ListItems.js';
import Collection from './Collection.js';

export default class Main extends Component {
  constructor() {
    super()
    this.state = {
      lists: [],
    }
    this.handleNewSubmit = this.handleNewSubmit.bind(this);
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.editItem = this.editItem.bind(this);
    this.handleUpdateChange = this.handleUpdateChange.bind(this);
  }

  componentDidMount() {
    firebase.database().ref('lists').on('value', (snapshot) => {
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
      console.log(collection);
    });
  }

  deleteList(delList) {
    // console.log(delList);
    firebase.database().ref('lists/' + delList).remove();
  }

  editItem(eList) {
    // console.log(eItem);
    this.setState({
      lists: this.state.lists.map((list) => {
        if (list.id === eList) {
          list.edit = !list.edit
          // console.log(item);

        }
        return list;
      })
    })
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

  handleUpdateChange(listId, e) {
    this.setState({
      list: this.state.lists.map((list) => {
        if (list.id === listId) {
          // console.log(listId);
          list.list = e.target.value
        }
        return list;
      })
    })

  }

  getStyle() {
    return {
      marginTop: '50px',
      marginBottom: '50px',
    };
  }

  handleNewSubmit(e) {
    e.preventDefault();
    const newList = {
      list: e.target.elements.text.value,
      edit: false,
      user: this.props.user ? this.props.user : 'demo',
    }
    this.setState({
      lists: this.state.lists.concat(newList),
    })
    e.target.elements.text.value = '';
    firebase.database().ref('lists').push(newList)
  }

  handleUpdateSubmit(uList, e) {
    e.preventDefault();
    const updateList = {
      list: e.target.elements.update.value,
      edit: false,
      user: this.props.user ? this.props.user : 'demo',
    }
    this.setState({
      lists: this.state.lists.map((list) => {
        if (list.id === uList) {
          list.edit = !list.edit
          // console.log(list);

        }
        return list;
      })
    })
    firebase.database().ref('lists/' + uList).update(updateList)
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
            <h1 className="text-center">Create List</h1>
            <form onSubmit={this.handleNewSubmit} style={this.getStyle()}>
              <div className="input-group-sm mb-3">
                <input className="form-control" name="text"/>
              </div>
              <div className="form-group">
                <button className="btn btn-success btn-sm">Add</button>
              </div>
            </form>
            <table className="table table-sm">
            <thead>
              <tr>
                <th className="text-center">Lists</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
              <Collection
                collection={this.state.lists}
                entry="list"
              />
            </table>
          </Route>
          <Route path={'/View/:id'} exact component={ListItems}/>
        </Router>
      </div>
    );
  }
}