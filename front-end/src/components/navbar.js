import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  
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
            <Link to="" className={`link ${path === "" || path === "/" ? "nav-active" : ""}`}>Home</Link>
          </li>
          <li>
            <Link to="/game" className={`link ${path.includes("/game") ? "nav-active" : ""}`}>Play</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
