import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
	return (
		<>
			<nav>
				<ul>
					<li>
						<Link to="" className='logo'>
							<img src={require("./MetaChess.png")} alt="" width="121px"/>
						</Link>
					</li>
					<li>
						<Link to="" className='link'>Home</Link>
					</li>
					<li>
						<Link to="/game" className='link'>Play</Link>
					</li>
				</ul>
			</nav>
		</>
	);
  }
}
