import React, {Component} from 'react';
// import firebase from '../firebase.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';

export default class Collection extends Component {
  getStyle() {
    return {
      marginTop: '50px',
      marginBottom: '50px',
    };
  }

  render() {
    return (
      <div>
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
                  this.props.lists.map((list) => {
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
                            <Link to={'/View/' + this.props.id}>
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
      </div>
    );
  }
}