import React, {Component} from 'react';
// import firebase from '../firebase.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';

export default class Collection extends Component {
  // constructor() {
  //   super();
  //   this.state = {
  //
  //   }
  // }

  render() {
    const collection = this.props.collection;
    const entry = this.props.entry;
    console.log(entry);
    return (
      <tbody>
        {
          collection.map((list) => {
            console.log(list[entry]);
            if (list.edit) {
              return (
                <tr key={list.id}>
                  <td className="text-center">
                  <form id="update" onSubmit={(e) => this.handleUpdateSubmit(list.id, e)}>
                    <input
                      className="text-center"
                      name="update"
                      value={list.entry}
                      onChange={(e) => this.handleUpdateChange(list.id, e)}
                    />
                  </form>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-success btn-sm" form="update" value="submit">Done</button>
                  </td>
                </tr>
              )
            } else {
              return (
                <tr key={list.id}>
                  <td className="text-center">{list[entry]}</td>
                  <td className="text-center">
                    <Link to={'/View/' + list.id}>
                      <button
                        className="btn btn-success btn-sm"
                      >
                        View
                      </button>
                    </Link>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => this.editItem(list.id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => this.deleteList(list.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            }

          })
        }
      </tbody>
    );
  }
}