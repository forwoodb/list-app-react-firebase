import React, {Component} from 'react';
import firebase from '../firebase.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';

export default class Main extends Component {
  constructor() {
    super()
    this.state = {
      items: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const newItem = {
      item: e.target.elements.text.value,
      edit: false,
      user: this.props.user ? this.props.user : 'demo',
    }
    this.setState({
      items: this.state.items.concat(newItem),
    })
    firebase.database().ref('items').push(newItem)
  }

  componentDidMount() {
    firebase.database().ref('items').on('value', (snapshot) => {
      // console.log(snapshot.val());

      let list = [];

      let user;
      if (this.props.user) {
        user = this.props.user;
      } else {
        user = 'demo';
      }

      // snapshot.forEach((item) => {
      //   list.push(item.val())
      // });

      // Alternatively:
      let data = snapshot.val();
      for (let item in data) {
        if (data[item].user === user) {
          list.push({
            id: item,
            item: data[item].item,
            edit: data[item].edit,
            user: data[item].user,
          })
        }
      }

      this.setState({
        items: list
      })
    });
  }

  deleteItem(delItem) {
    console.log(delItem);
    firebase.database().ref('items/' + delItem).remove();
  }

  editItem(eItem) {
    // console.log(eItem);
    this.setState({
      items: this.state.items.map((item) => {
        if (item.id === eItem) {
          item.edit = !item.edit
          // console.log(item);

        }
        return item;
      })
    })
  }

  handleUpdateChange(e) {
    this.setState({
      item: e.target.value
    })

  }

  updateItem(uItem) {
    console.log(uItem);
    this.setState({
      items: this.state.items.map((item) => {
        if (item.id === uItem) {
          item.edit = !item.edit
          console.log(item);

        }
        return item;
      })
    })
  }

  getStyle() {
    return {
      marginTop: '50px',
      marginBottom: '50px',
    };
  }

  render() {
    return (
      <div className="container">
        <h1 className="text-center">List</h1>
        <div className="row">
          <div className="col"></div>
          <div className="col-6">
            <form onSubmit={this.handleSubmit} style={this.getStyle()}>
              <div className="form-group">
                <input className="form-control" name="text"/>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <button className="btn btn-success">Add Item</button>
                </div>
                <div className="form-group ml-4">
                  <Link to={'/'}>
                    <button className="btn btn-primary">Update List</button>
                  </Link>
                </div>
              </div>
            </form>
            <table className="table">
            <thead>
              <tr>
                <th className="text-center">Items</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
              <tbody>
                {
                  this.state.items.map((item) => {
                    if (item.edit) {
                      return (
                        <tr key={item.id}>
                          <td className="text-center">
                            <input className="text-center" name="update" value={item.item} onChange={this.handleUpdateChange}/>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-danger" onClick={() => this.deleteItem(item.id)}>Delete</button>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-success" onClick={() => this.updateItem(item.id)}>Done</button>
                          </td>
                        </tr>
                      )
                    } else {
                      return (
                        <tr key={item.id}>
                          <td className="text-center"  width="240px">{item.item}</td>
                          <td className="text-center">
                            <button className="btn btn-danger" onClick={() => this.deleteItem(item.id)}>Delete</button>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-primary" onClick={() => this.editItem(item.id)}>Edit</button>
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
      </div>
    );
  }
}