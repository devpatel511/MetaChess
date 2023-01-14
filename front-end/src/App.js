import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Navbar from "./UI/navbar";
import Board from './UI/board';
import Users from './UI/users';

// const API_BASE = "http://localhost:3001"

function App() {
  return (
	<BrowserRouter>
		<Navbar />
		<Routes>
			<Route path="/" element={<Users/>}/>
			<Route path="/game" element={<Board/>}/>
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
