import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <div className='Navbar'>
        <nav>
            <ul>
              <li>
                <Link to="/"><i className="fa fa-fw fa-home"/>Home</Link>
              </li>
              <li>
                <Link to="/game"><i className="fas fa-chess-knight"/>Game</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/stats">Stats</Link>
              </li>
            </ul>
        </nav>
      </div>
    );
  }
}
