import React, {Component} from 'react';
import firebase from '../firebase.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';

import Collection from './Collection.js';

export default class ListItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: '',
      items: [],
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.handleUpdateChange = this.handleUpdateChange.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  componentDidMount() {
    firebase.database().ref('lists/' + this.props.match.params.id).on('value', (snapshot) => {
      let items = [];

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
          items.push({
            id: item,
            item: data[item].item,
            edit: data[item].edit,
            user: data[item].user,
          })
        }
      }

      this.setState({
        list: data.list,
        items: items,
        // items: data.items,
      })
      console.log(items);
    });
  }

  deleteItem(delItem) {
    console.log(delItem);
    firebase.database().ref('lists/' + this.props.match.params.id).child(delItem).remove();
  }

  editItem(eItem) {
    this.setState({
      items: this.state.items.map((item) => {
        if (item.id === eItem) {
          item.edit = !item.edit
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

  handleSubmit(e) {
    e.preventDefault();
    const newItem = {
      id: new Date(),
      item: e.target.elements.text.value,
      edit: false,
      user: this.props.user ? this.props.user : 'demo',
    }
    this.setState({
      items: this.state.items.concat(newItem),
    })
    e.target.elements.text.value = '';
    firebase.database().ref('lists/' + this.props.match.params.id).push(newItem)
    // firebase.database().ref('lists/' + this.props.match.params.id).child('items').push(newItem)
  }

  render() {
    // console.log(this.state.items);
    return (
      <div className="container">
        <h2 className="text-center">{this.state.list}</h2>
        <form onSubmit={this.handleSubmit} style={this.getStyle()}>
          <div className="input-group-sm mb-3">
            <input className="form-control" name="text"/>
          </div>
          <div className="form-row">
            <div className="form-group">
              <button className="btn btn-success btn-sm">Add Item</button>
            </div>
            <div className="form-group ml-4">
              <Link to={'/'}>
                <button className="btn btn-primary btn-sm">Update List</button>
              </Link>
            </div>
          </div>
        </form>
        <table className="table table-sm">
        <thead>
          <tr>
            <th className="text-center">Items</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
          <Collection
            collection={this.state.items}
            entry="item"
            style={this.getStyle()}
          />
        </table>
      </div>
    );
  }
}

// <tbody>
//   {
//     this.state.items.map((item) => {
//       if (item.edit) {
//         return (
//           <tr key={item.id}>
//             <td className="text-center">
//               <input
//                 className="text-center"
//                 name="update"
//                 value={item.item}
//                 onChange={this.handleUpdateChange}
//               />
//             </td>
//             <td className="text-center">
//               <button className="btn btn-success btn-sm" onClick={() => this.updateItem(item.id)}>Done</button>
//             </td>
//             <td className="text-center">
//               <button className="btn btn-danger btn-sm" onClick={() => this.deleteItem(item.id)}>Delete</button>
//             </td>
//           </tr>
//         )
//       } else {
//         return (
//           <tr key={item.id}>
//             <td className="text-center"  width="240px">{item.item}</td>
//             <td className="text-center">
//               <button className="btn btn-primary btn-sm" onClick={() => this.editItem(item.id)}>Edit</button>
//             </td>
//             <td className="text-center">
//               <button className="btn btn-danger btn-sm" onClick={() => this.deleteItem(item.id)}>Delete</button>
//             </td>
//           </tr>
//         )
//       }
//
//     })
//   }
// </tbody>