import Board from "../UI/board";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Link } from 'react-router-dom';

function Game() {
    return (
        <>
            <Link to="/game/local">LEt's Play</Link>
            <Routes>
                <Route path="/game/online" element={<p>Online</p>}/>
                <Route path="/game/computer" element={<p>Computer</p>}/>
                <Route path="/game/local" element={<Board/>} />
            </Routes>
        </>
    )
}

export default Game