import React, {Component} from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default class NavBar extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Brand>List App</Navbar.Brand>
        <Navbar.Toggle/>
        <Navbar.Collapse>
          <Nav className="mr-auto">
            {this.props.user ?
              <button className="btn btn-sm" onClick={this.props.logout}>Log Out</button>
              :
              <button className="btn btn-sm" onClick={this.props.login}>Log In</button>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}