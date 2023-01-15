import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Navbar from "./components/navbar";
import Board from './UI/board';
import Users from './components/users';
import Game from './Model/game';

// const API_BASE = "http://localhost:3001"

function App() {
  return (
	<BrowserRouter>
		<Navbar />
		<Routes>
			<Route path="/" element={<Users/>}/>
			<Route path="/game" element={<Game/>}/>
			<Route path="/login" element={<h1>Login Page</h1>}/>
			<Route path="/stats" element={<h1>Stats Page</h1>}/>
			<Route path="/game/local" element={<Board/>}/>
			{/* <div className="moves">
				<h1>Moves</h1>
				<p>e4</p>
				<p>e5</p>
			</div> */}
		</Routes>
	</BrowserRouter>
  );
}

export default App;
