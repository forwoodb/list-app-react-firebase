import React, {Component} from 'react';
import firebase from '../firebase.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import NavBar from './NavBar.js';
import ListItems from './ListItems.js';
// import Collection from './Collection.js';

export default class Main extends Component {
  constructor() {
    super()
    this.state = {
      lists: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteList = this.deleteList.bind(this);
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

  getStyle() {
    return {
      marginTop: '50px',
      marginBottom: '50px',
    };
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
            <div className="row">
              <div className="col"></div>
              <div className="col-6">
                <form onSubmit={this.handleSubmit} style={this.getStyle()}>
                  <div className="form-group">
                    <input className="form-control" name="text"/>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-success">Add</button>
                  </div>
                </form>
                <table className="table">
                <thead>
                  <tr>
                    <th className="text-center">Lists</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                  <tbody>
                    {
                      this.state.lists.map((list) => {
                        if (list.edit) {
                          return (
                            <tr key={list.id}>
                              <td className="text-center">
                                <input className="text-center" name="update" value={list.list} onChange={this.handleUpdateChange}/>
                              </td>
                              <td className="text-center">
                                <button className="btn btn-danger" onClick={() => this.deleteList(list.id)}>Delete</button>
                              </td>
                              <td className="text-center">
                                <button className="btn btn-success" onClick={() => this.updateList(list.id)}>Done</button>
                              </td>
                            </tr>
                          )
                        } else {
                          return (
                            <tr key={list.id}>
                              <td className="text-center"  width="240px">{list.list}</td>
                              <td className="text-center">
                                <button
                                  className="btn btn-danger"
                                  onClick={() => this.deleteList(list.id)}
                                >
                                  Delete
                                </button>
                              </td>
                              <td className="text-center">
                                <Link to={'/View/' + list.id}>
                                  <button
                                    className="btn btn-success"
                                  >
                                    View
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          )
                        }

                      })
                    }
                  </tbody>
                </table>
              </div>
              <div className="col"></div>
            </div>
          </Route>
          <Route path={'/View/:id'} exact component={ListItems}/>
        </Router>
      </div>
    );
  }
}