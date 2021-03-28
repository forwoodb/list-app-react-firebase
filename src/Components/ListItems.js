import React, {useState, useEffect} from 'react';
// import React, {Component} from 'react';
import firebase from '../firebase.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';

export default function ListItems(props) {
  const [list, setList] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    firebase.database().ref('lists/' + props.match.params.id).on('value', (snapshot) => {
      let items = [];

      let user;
      if (props.user) {
        user = props.user;
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

      setList(data.list);
      setItems(items);
    });
  }, [])

  const deleteItem = (delItem) => {
    console.log(delItem);
    firebase.database().ref('lists/' + this.props.match.params.id).child(delItem).remove();
  }

  const editItem = (eItem) => {
    setItems(items.map((item) => {
        if (item.id === eItem) {
          item.edit = !item.edit
        }
        return item;
      })
    )
  }

  const handleUpdateChange = (itemId, e) => {
    setItems(items.map((item) => {
        if (item.id === itemId) {
          item.item = e.target.value
        }
        return item;
      })
    )
  }

  const updateItem = (uItem) => {
    setItems(items.map((item) => {
        if (item.id === uItem) {
          item.edit = !item.edit
          console.log(item);

        }
        return item;
      })
    )
  }

  const getStyle = () => {
    return {
      marginTop: '50px',
      marginBottom: '50px',
    };
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: new Date(),
      item: e.target.elements.text.value,
      edit: false,
      user: props.user ? props.user : 'demo',
    }
    setItems(items.concat(newItem))
    e.target.elements.text.value = '';
    firebase.database().ref('lists/' + props.match.params.id).push(newItem)
    // firebase.database().ref('lists/' + props.match.params.id).child('items').push(newItem)
  }

  return (
    <div className="container">
      <h2 className="text-center">{list}</h2>
      <form onSubmit={handleSubmit} style={getStyle()}>
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
        <tbody>
          {
            items.map((item) => {
              if (item.edit) {
                return (
                  <tr key={item.id}>
                    <td className="text-center">
                      <input className="text-center" name="update" value={item.item} onChange={(e) => handleUpdateChange(item.id, e)}/>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-success btn-sm" onClick={() => updateItem(item.id)}>Done</button>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>Delete</button>
                    </td>
                  </tr>
                )
              } else {
                return (
                  <tr key={item.id}>
                    <td className="text-center"  width="240px">{item.item}</td>
                    <td className="text-center">
                      <button className="btn btn-primary btn-sm" onClick={() => editItem(item.id)}>Edit</button>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>Delete</button>
                    </td>
                  </tr>
                )
              }

            })
          }
        </tbody>
      </table>
    </div>
  );
}