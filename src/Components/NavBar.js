import React, {Component} from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function NavBar(props) {
  return (
    <Navbar>
      <Navbar.Brand>List App</Navbar.Brand>
      <Navbar.Toggle/>
      <Navbar.Collapse>
        <Nav className="mr-auto">
          {props.user ?
            <button className="btn btn-sm" onClick={props.logout}>Log Out</button>
            :
            <button className="btn btn-sm" onClick={props.login}>Log In</button>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}