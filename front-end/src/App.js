import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Navbar from "./components/navbar";
import Board from './UI/board';
import Home from './components/home';
import Game from './Model/game';
import Login from './components/login';
import OnlineBoard from './UI/onlineBoard';
import ComputerBoard from './UI/computerBoard';
import Leaderboard from './components/leaderboard';

function App() {
  return (
	<BrowserRouter>
		<Navbar />
		<Routes>
			<Route path="" element={<Home/>}/>
			<Route path="/game" element={<Game/>}/>
			<Route path="/login/:userId" element={<Login/>}/>
			<Route path="/game/local" element={<Board/>}/>
			<Route path="/game/computer/:userId" element={<ComputerBoard/>}/>
			<Route path="/game/online/:userId" element={<OnlineBoard/>}/>
			<Route path="/game/leaderboard" element={<Leaderboard/>}/>
		</Routes>
	</BrowserRouter>
  );
}

export default App;
