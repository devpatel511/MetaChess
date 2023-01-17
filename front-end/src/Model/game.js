import { Link } from 'react-router-dom';

function Game() {
    return (
        <>
            <Link to="/game/local">Play Local</Link>
            <br/>
            <Link to="game/online">Play Online</Link>
            <br/>
            <Link to="game/computer">Play Computer</Link>
        </>
    )
}

export default Game