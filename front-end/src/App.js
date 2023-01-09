import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Navbar from "./UI/navbar";
import Board from './UI/board';
import Users from './UI/users';

// const API_BASE = "http://localhost:3001"

function App() {
  return (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Users/>}/>
			{/* <Navbar />
			<br/>
			<Route path="/" exact>
				<Board></Board>
			</Route> */}
			{/* <Route path="/edit/:id" />
			<Route path="/create"  />
			<Route path="/user">
				<Board></Board>
			</Route> */}
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
