import React, {Component} from 'react';
import firebase from '../firebase.js';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

export default function ViewButton(props) {
  return (
    props.collection.map((list) => {
      return <td className="text-center">
        <Link to={'/View/' + list.id}>
          <button
            className="btn btn-success btn-sm"
          >
            View
          </button>
        </Link>
      </td>
    })
  );
}