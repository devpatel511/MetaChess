import Board from './UI/board';

// const API_BASE = "http://localhost:3001"

function App() {
  return (
	<div className="App">
		<Board></Board>
		<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Chess_plt60.png"></img>
		<div class="moves">
			<h1>Moves</h1>
			<p>e4</p>
			<p>e5</p>
		</div>
	</div>
  );
}

export default App;
