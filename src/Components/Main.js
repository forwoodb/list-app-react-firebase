import React, {useState, useEffect} from 'react';
import firebase from '../firebase.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import NavBar from './NavBar.js';
import ListItems from './ListItems.js';

export default function Main(props) {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    firebase.database().ref('lists').on('value', (snapshot) => {
      let collection = [];

      let user;
      if (props.user) {
        user = props.user;
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

      setLists(collection)
    });
  }, [])

  const deleteList = (delList) => {
    // console.log(delList);
    firebase.database().ref('lists/' + delList).remove();
  }

  const editItem = (eList) => {
    // console.log(eItem);
    setLists(lists.map((list) => {
        if (list.id === eList) {
          list.edit = !list.edit
          // console.log(item);

        }
        return list;
      })
    )
  }

  const viewList = (vList) => {
    // console.log(vList);
    setLists(lists.map((list) => {
        if (list.id === vList) {
          list.edit = !list.edit
          // console.log(list);

        }
        return list;
      })
    )
  }

  const handleUpdateChange = (listId, e) => {
    setLists(lists.map((list) => {
        if (list.id === listId) {
          list.list = e.target.value
        }
        return list;
      })
    )
  }

  const getStyle = () => {
    return {
      marginTop: '50px',
      marginBottom: '50px',
    };
  }

  const handleNewSubmit = (e) => {
    e.preventDefault();
    const newList = {
      list: e.target.elements.text.value,
      edit: false,
      user: props.user ? props.user : 'demo',
    }
    setLists(lists.concat(newList))
    e.target.elements.text.value = '';
    firebase.database().ref('lists').push(newList)
  }

  const handleUpdateSubmit = (uList, e) => {
    e.preventDefault();
    const updateList = {
      list: e.target.elements.update.value,
      edit: false,
      user: props.user ? props.user : 'demo',
    }
    setLists(lists.map((list) => {
        if (list.id === uList) {
          list.edit = !list.edit
          // console.log(list);

        }
        return list;
      })
    )
    firebase.database().ref('lists/' + uList).update(updateList)
  }

  return (
    <div className="container">
      <Router>
        <NavBar
          user={props.user}
          login={props.login}
          logout={props.logout}
        />
        <Route exact path="/">
          <h1 className="text-center">Create List</h1>
          <form onSubmit={handleNewSubmit} style={getStyle()}>
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
            <tbody>
              {
                lists.map((list) => {
                  if (list.edit) {
                    return (
                      <tr key={list.id}>
                        <td className="text-center">
                        <form id="update" onSubmit={(e) => handleUpdateSubmit(list.id, e)}>
                          <input
                            className="text-center"
                            name="update"
                            value={list.list}
                            onChange={(e) => handleUpdateChange(list.id, e)}
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
                        <td className="text-center">{list.list}</td>
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
                            onClick={() => editItem(list.id)}
                          >
                            Edit
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteList(list.id)}
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
          </table>
        </Route>
        <Route path={'/View/:id'} exact component={ListItems}/>
      </Router>
    </div>
  );
}