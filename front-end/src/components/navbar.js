import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
	return (
		<>
			<nav>
				<ul>
					<li>
						<Link to="/" className='link'>MetaChess</Link>
					</li>
					<li>
						<Link to="/" className='link active'>HOME</Link>
					</li>
					<li>
						<Link to="/game" className='link'>PLAY</Link>
					</li>
					<li>
						<Link to="/login" className='link'>LOGIN</Link>
					</li>
					<li>
						<Link to="/stats" className='link'>STATS</Link>
					</li>
					<li>
						<Link to="/login" className="link signUp">SIGN UP</Link>
					</li>
				</ul>
			</nav>
		</>
	);
  }
}
