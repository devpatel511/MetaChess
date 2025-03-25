import React, { useState, useEffect } from 'react'; 
import Piece from '../Model/piece'
import assets from './assets';
import sound from './src_chess_assets_moveSoundEffect.mp3';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE + "/game/computer/";

const audio = new Audio(sound);
audio.muted = false;

function Board() {
    const [board, setBoard] = useState([]);
    const [cells, setCells] = useState([]);
    const [curr, setCurr] = useState(new Piece("", 0, ""));
    const [pos, setPos] = useState([])
    const [moves, setMoves] = useState([]);
    const [turn, setTurn] = useState(0)
    const [clicked, setClicked] = useState(false)
    const [passants, setPassants] = useState([])
    const [popupActive, setPopupActive] = useState(false)
    const [color, setColor] = useState(0)
    const [squareNew, setSquare] = useState("")
    const [gameOver, setGameOver] = useState(false)
    const navigate = useNavigate();
    const [move, setMove] = useState(0);
    const [letters, setLetters] = useState(["a", "b", "c", "d", "e", "f", "g", "h"]);
    const { userId } = useParams();
    const [userElo, setUserElo] = useState(0);

    var isGreyCell = false;

    useEffect(() => {
        fetch(process.env.REACT_APP_API_BASE + "/user/elo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user1: userId,
                }) })
                .then(res => res.json())
                .then(data => setUserElo(data.user1))
                .catch(err => console.error("Error: ", err));
        var randomInt = Math.round(Math.random());
        CreateCells(randomInt);
        CreateBoard(randomInt);
        setMove(randomInt);
    // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (letters[0] !== "h" && move === 1) {
            setLetters(letters.slice().reverse());
        }
    }, [move, letters])

    const PlayComputer = async () => {
        const fen = getFEN();
        await fetch(API_BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                FEN: fen
            })
        })
            .then(res => res.json())
            .then(data => ComputerMove(data))
            .catch(err => console.error("Error: ", err));
    };

    useEffect(() => {
        if (turn !== move && turn < 2 && !popupActive) {
            setTimeout(() => {
                PlayComputer();
            }, 1000);
        }
    // eslint-disable-next-line
    }, [turn, move, popupActive])

    const ComputerMove = async (data) => {
        if (data === null) {
            for (var i = 7; i >= 0; i--) {
                for (var j = 7; j >= 0; j--) {
                    const z = board[i][j];
                    if (z instanceof Object && z.id === "K" && z.color === 1) {
                        z.moves(i, j, board)
                        const options = z.options
                        if (options.length === 0) {
                            await fetch(API_BASE + userId, { 
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    result: "W"
                                }) })
                                    .then(res => res.json())
                                    .catch(err => console.error("Error: ", err));
                            setGameOver(true)
                            if (turn === 0) {
                                setTurn(2)
                            } else {
                                setTurn(3)
                            }
                            return;
                        }
                        Move(`${options[0][0]}${options[0][1]}|||`, z, [i, j], []);
                        return;
                    }
                }
            }
        }

        const fileNum = {
            "A": 0,
            "B": 1,
            "C": 2,
            "D": 3,
            "E": 4,
            "F": 5,
            "G": 6,
            "H": 7
        }

        for (var key in data) {
            const i = parseInt(data[key].charAt(1))-1, j = fileNum[data[key].charAt(0)], x = parseInt(key.charAt(1))-1, y = fileNum[key.charAt(0)];

            if (move === 0) {
                var temp = []
                const p = board[x][y]
                p.moves(x, y, board)
                const options = p.options
                for (var k=0; k<options.length; k++) {
                    const x = 7 - options[k][0]
                    const y = 1 + options[k][1]
                    if (options[k].length > 2) {
                        temp.push([x, y, options[k][2]])
                    } else {
                        temp.push([x, y])
                    }
                }
                Move(`${i}${j}|||`, board[x][y], [x, y], temp);
            } else {
                var temp2 = []
                const p = board[7-x][7-y]
                p.moves(7-x, 7-y, board)
                const options = p.options
                for (var b=0; b<options.length; b++) {
                    const x = 7 - options[b][0]
                    const y = 1 + options[b][1]
                    if (options[b].length > 2) {
                        temp2.push([x, y, options[b][2]])
                    } else {
                        temp2.push([x, y])
                    }
                }
                Move(`${7-i}${7-j}|||`, board[7-x][7-y], [7-x, 7-y], temp2);
            }
        }
    };

    const getFEN = () => {
        var fen = '';
        var emptySquares = 0;
        var blackCastle = '';
        var whiteCastle = '';
        var enPassantSquare = '-';

        if (move === 0) {
            for (let rank = 7; rank >= 0; rank--) {
                for (let file = 0; file < 8; file++) {
                    const piece = board[rank][file];
                    if (!(piece instanceof Object)) {
                        emptySquares++;
                    } else {
                        if (emptySquares > 0) {
                            fen += emptySquares;
                            emptySquares = 0;
                        }
                        if (piece.id === "K") {
                            piece.moves(rank, file, board);
                            for (var m=0; m<piece.options.length; m++) {
                                if (piece.options[m].length > 2) {
                                    if (piece.options[m][2]) {
                                        if (piece.color === 0) {
                                            whiteCastle = whiteCastle + "Q";
                                        } else {
                                            blackCastle = blackCastle + "q"
                                        }
                                    } else {
                                        if (piece.color === 0) {
                                            whiteCastle = "K" + whiteCastle;
                                        } else {
                                            blackCastle = "k" + blackCastle;
                                        }
                                    }
                                }
                            }
                        } else if (piece.id === "") {
                            if (piece.passant) {
                                enPassantSquare = `${letters[file]}${rank === 3 ? 3 : 6}`;
                            }
                            if (piece.color === 0) {
                                fen += "P";
                            } else {
                                fen += "p";
                            }
                        }
                        if (piece.color === 0) {
                            fen += piece.id;
                        } else {
                            fen += piece.id.toLowerCase();
                        }
                    }
                }
                
                if (emptySquares > 0) {
                    fen += emptySquares;
                    emptySquares = 0;
                }

                if (rank > 0) {
                    fen += '/';
                }
            }

            const activeColor = move === 0 ? 'b' : 'w';
            const castlingAvailability = blackCastle === "" && whiteCastle === "" ? "-" : whiteCastle + blackCastle;

            
            fen += ` ${activeColor} ${castlingAvailability} ${enPassantSquare}`;

            return fen;
        } else {
            for (let rank = 0; rank < 8; rank++) {
                for (let file = 7; file >= 0; file--) {
                    const piece = board[rank][file];
                    if (!(piece instanceof Object)) {
                        emptySquares++;
                    } else {
                        if (emptySquares > 0) {
                            fen += emptySquares;
                            emptySquares = 0;
                        }
                        if (piece.id === "K") {
                            piece.moves(rank, file, board);
                            for (var k=0; k<piece.options.length; k++) {
                                if (piece.options[k].length > 2) {
                                    if (piece.options[k][2]) {
                                        if (piece.color === 0) {
                                            blackCastle = "k" + blackCastle;
                                        } else {
                                            whiteCastle = "K" + whiteCastle;
                                        }
                                    } else {
                                        if (piece.color === 0) {
                                            blackCastle = blackCastle + "q"
                                        } else {
                                            whiteCastle = whiteCastle + "Q";
                                        }
                                    }
                                }
                            }
                        } else if (piece.id === "") {
                            if (piece.passant) {
                                enPassantSquare = `${letters[7-file]}${rank === 3 ? 6 : 3}`;
                            }
                            if (piece.color === 0) {
                                fen += "p";
                            } else {
                                fen += "P";
                            }
                        }
                        if (piece.color === 0) {
                            fen += piece.id.toLowerCase();
                        } else {
                            fen += piece.id;
                        }
                    }
                }
                
                if (emptySquares > 0) {
                    fen += emptySquares;
                    emptySquares = 0;
                }

                if (rank < 7) {
                    fen += '/';
                }
            }

            const activeColor = turn === 0 ? 'w' : 'b';
            const castlingAvailability = blackCastle === "" && whiteCastle === "" ? "-" : whiteCastle + blackCastle;

            
            fen += ` ${activeColor} ${castlingAvailability} ${enPassantSquare}`;

            return fen;
        }
    }

    const CreateCells = (num) => {
        if (num === 1) {
            const temp = []
            for (let i=0; i<8; i++) {
                temp.push([])
                for (let j=-1; j<8; j++) {
                    if (j === -1) {
                        temp[i].push(i+1);
                    } else {
                        temp[i].push((7-i).toString()+ j.toString())
                    }
                }
            }
            setCells(temp);
        } else {
            const temp = []
            for (let i=0; i<8; i++) {
                temp.push([])
                for (let j=-1; j<8; j++) {
                    if (j === -1) {
                        temp[i].push(8-i);
                    } else {
                        temp[i].push((7-i).toString()+ j.toString())
                    }
                }
            }
            setCells(temp)
        }
    }

    const CreateBoard = (num) => {
        var backRank = ["Rook", "Nknight", "Bishop", "Queen", "King", "Bishop", "Nknight", "Rook"]
        if (num === 1) {
            backRank[3] = "King";
            backRank[4] = "Queen";
        }
        var temp = []
        temp.push([])
        for (let j=0; j<8; j++) {
            temp[0].push(new Piece(backRank[j], 0, backRank[j].charAt(0)))
        }
        temp.push([])
        for (let j=0; j<8; j++) {
            temp[1].push(new Piece("pawn", 0, ""))
        }
        for (let i=2; i<6; i++) {
            temp.push([])
            for (let j=0; j<8; j++) {
                temp[i].push(null)
            }
        }
        temp.push([])
        for (let j=0; j<8; j++) {
            temp[6].push(new Piece("pawn", 1, ""))
        }
        temp.push([])
        for (let j=0; j<8; j++) {
            temp[7].push(new Piece(backRank[j], 1, backRank[j].charAt(0)))
        }
        setBoard(temp)
    }

    const IsPiece = (prop) => {
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        if (board[i][j] instanceof Object) {
            return true
        }
        return false
    }

    const Hoverable = (prop) => {
        if (turn !== move) {
            return false;
        }
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        if (board[i][j] instanceof Object) {
            const p = board[i][j]
            if (p.color === 0 & cells[7-i][j+1].length <= 2) {
                return true
            }
            return false
        }
        return false
    }

    const GetPiece = (prop) => {
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        if (move === 1) {
            return assets[board[i][j].name][board[i][j].color === 0 ? 1 : 0];
        } else {
            return assets[board[i][j].name][board[i][j].color];
        }
    }

    const IsRank = (prop) => {
        return Number.isInteger(prop)
    }

    const toggle = (prop) => {
        if (parseInt(prop.charAt(1)) === 7) {
            return
        } else if (isGreyCell) {
            isGreyCell = false
        } else {
            isGreyCell = true
        }
    }

    const Options = (prop) => {
        if (clicked) {
            DeleteMoves()
        }
        setClicked(true)
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        const p = board[i][j]
        setCurr(p)
        setPos([i, j])
        var temp = []
        p.moves(i, j, board)
        const options = p.options
        for (var k=0; k<options.length; k++) {
            const x = 7 - options[k][0]
            const y = 1 + options[k][1]
            cells[x][y] += "1"
            if (options[k].length > 2) {
                temp.push([x, y, options[k][2]])
            } else {
                temp.push([x, y])
            }
        }
        setMoves(() => temp)
        setCells(cells.map(cell => cell))
    }

    const IsGreen = (prop) => {
        if (prop.length >= 3) {
            if (prop.charAt(2) === "1") {
                return true
            }
            return false
        } else {
            return false
        }
    }

    const Move = async (prop, optCurr, optPos, temp) => {
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        if (IsPiece(prop.charAt(0)+prop.charAt(1))) {
            if (board[i][j].id === "K") {
                if (turn === move) {
                    await fetch(API_BASE + userId, { 
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            result: "W"
                        }) })
                            .then(res => res.json())
                            .catch(err => console.error("Error: ", err));
                } else {
                    await fetch(API_BASE + userId, { 
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            result: "L"
                        }) })
                            .then(res => res.json())
                            .catch(err => console.error("Error: ", err));
                }
                setGameOver(true)
                if (turn === 0) {
                    setTurn(2)
                } else {
                    setTurn(3)
                }
            }
        }
        if (prop.length > 4) {
            board[i][j] = optCurr;
        } else {
            board[i][j] = curr
        }
        if (PawnLastRow(prop.charAt(0)+prop.charAt(1))) {
            if (i === 0) {
                board[i][j] = new Piece("Queen", 1, "Q");
            } else {
                Popup(prop.charAt(0)+prop.charAt(1))
            }
        }
        if (prop.length > 4) {
            board[optPos[0]][optPos[1]] = null
        } else {
            board[pos[0]][pos[1]] = null
        }
        if (prop.length > 4) {
            DeleteMoves(j, temp);
        } else {
            DeleteMoves(j)
        }
        setBoard(board.map(b => b))
        setClicked(false)
        for (const p of passants) {
            p.passant = false
        }
        setPassants([])
        if (prop.length > 4) {
            if (optCurr.id === "") {
                if (optCurr.castle & optCurr.color === 0 & i === 3) {
                    optCurr.passant = true
                    setPassants([...passants, optCurr])
                } else if (optCurr.castle & optCurr.color === 1 & i === 4) {
                    optCurr.passant = true
                    setPassants([...passants, optCurr])
                }
            }
            optCurr.castle = false
        } else if (curr.id === "") {
            if (curr.castle & curr.color === 0 & i === 3) {
                curr.passant = true
                setPassants([...passants, curr])
            } else if (curr.castle & curr.color === 1 & i === 4) {
                curr.passant = true
                setPassants([...passants, curr])
            }
        }
        curr.castle = false;
        if (pos.length > 0) {
            audio.play()
        }
        setTurn(num => num === 0 ? 1 : (num !== 1 ? num : 0))
    }

    const DeleteMoves = (j, t) => {
        var gameMoves = moves;
        if (t !== undefined) {
            gameMoves = t;
        }
        for (let k=0; k<gameMoves.length; k++) {
            const x = gameMoves[k][0]
            const y = gameMoves[k][1]
            if (t === undefined) {
                cells[x][y] = cells[x][y].slice(0, -1)
            }
            if (gameMoves[k].length > 2) {
                const temp = gameMoves[k][2]
                if (temp === 1 & j === y-1) {
                    board[6-x][y-1] = null
                } else if (temp === 2 & j === y-1) {
                    board[8-x][y-1] = null
                } else if (move === 0 && temp & j === 2) {
                    board[7-x][y] = board[7-x][0]
                    board[7-x][0] = null
                } else if (move === 0 && !temp & j === 6) {
                    board[7-x][y-2] = board[7-x][7]
                    board[7-x][7] = null
                } else if (move === 1 && temp & j === 1) {
                    board[7-x][y] = board[7-x][0]
                    board[7-x][0] = null
                } else if (move === 1 && !temp & j === 5) {
                    board[7-x][y-2] = board[7-x][7]
                    board[7-x][7] = null
                } 
            }
        }
        setMoves([]);
        setCells(cells.map(c => c))
    }

    const PawnLastRow = (prop) => {
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        const p = board[i][j]
        if (p instanceof Object) {
            if (p.id === "") {
                if (i === 7 & p.color === 0) {
                    return true
                } else if (i === 0 & p.color === 1) {
                    return true
                }
                return false
            }
            return false
        }
        return false
    }
    
    const Popup = (prop) => {
        setPopupActive(true)
        setSquare(prop)
        setColor(curr.color)
    }

    const Swap = (color, name) => {
        setPopupActive(false)
        const i = squareNew.charAt(0)
        const j = squareNew.charAt(1)
        board[i][j] = new Piece(name, color, name.charAt(0))
    }

    return (
        <div className='bird-box'>
        <div className="board">
            {cells.map(cell => (
                cell.map(square => (
                    IsRank(square) ? 
                        <div className="rank" key={square}>{square}</div> : 
                        <div className={"gamecell " + (isGreyCell ? "grey " : "") + (Hoverable(square) ? "ocup ": "") + (IsGreen(square) ? "green " : "")} 
                            key={square} onClick={Hoverable(square) ? (() => Options(square)) : (IsGreen(square) ? (() => Move(square)): null)}>
                            {toggle(square)}
                            {IsPiece(square) ? <img className="piece" src={GetPiece(square)} alt=""></img>: ''}
                        </div>
                ))
            ))}
            
            {gameOver ? (
                <div className="popup">
                    <div className="content justified">
                        <h3>Game Over</h3>
                        <div className='winner'>
                            <h2>Winner: <span className='wb'>{turn === 3 ? "Black" : "White"}</span></h2>
                            <div className='btn'>
                                <button onClick={() => setGameOver(false)}>View Board</button>
                                <button onClick={() => navigate("/game/leaderboard")}>Leaderboard</button>
                                <button onClick={() => window.location.reload()}>Play Again</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : popupActive ? (
                <div className="popup">
                    <div className="content">
                        <h3>Pawn Promotion</h3>
                        <div className="choices" onClick={() => Swap(color, "Queen")}>
                            <img className='pieceAdv' src={assets["Queen"][move === 0 ? color : color === 0 ? 1 : 0]} alt=""></img>
                        </div>
                        <div className={"choices grey "} onClick={() => Swap(color, "Nknight")}>
                            <img className='pieceAdv' src={assets["Nknight"][move === 0 ? color : color === 0 ? 1 : 0]} alt=""></img>
                        </div>
                        <div className={"choices grey "} onClick={() => Swap(color, "Rook")}>
                            <img className='pieceAdv' src={assets["Rook"][move === 0 ? color : color === 0 ? 1 : 0]} alt=""></img>
                        </div>
                        <div className="choices" onClick={() => Swap(color, "Bishop")}>
                            <img className='pieceAdv' src={assets["Bishop"][move === 0 ? color : color === 0 ? 1 : 0]} alt=""></img>
                        </div>
                    </div>
                </div>
            ) : ""}

            <div className="file"></div>
            <div className="file">{letters[0]}</div>
            <div className="file">{letters[1]}</div>
            <div className="file">{letters[2]}</div>
            <div className="file">{letters[3]}</div>
            <div className="file">{letters[4]}</div>
            <div className="file">{letters[5]}</div>
            <div className="file">{letters[6]}</div>
            <div className="file">{letters[7]}</div>
        </div>
        <div className='match'>
                <div className="game__meta snipcss-sobXV">
                    <section>
                        <div className="game__meta__infos" data-icon="">
                        <div>
                            <div className="header">
                            <div className="setup">
                                +100 / -100
                            </div>
                            <time className="set" datetime="2023-08-17T02:09:19.031Z" title="Aug 16, 2023, 10:09 PM">
                                Computer
                            </time>
                            </div>
                        </div>
                        </div>
                        <div className="game__meta__players">
                        <div className="player color-icon is white text">
                            <span className="user-link">
                                {move === 0 ? (
                                    <>
                                        {userId} <span className='elo-num'>&nbsp;{userElo}</span> 
                                    </>
                                ): (
                                    <>
                                        MetaChess Bot <span className='elo-num'>&nbsp;~1000</span> 
                                    </>
                                )}   
                            </span>
                        </div>
                        <div className="player color-icon is black text">
                            <span className="user-link">
                                {move === 1 ? (
                                    <>
                                        {userId} <span className='elo-num'>&nbsp;{userElo}</span> 
                                    </>
                                ): (
                                    <>
                                        MetaChes Bot <span className='elo-num'>&nbsp;~1000</span> 
                                    </>
                                )}   
                            </span>
                        </div>
                        </div>
                    </section>
                    <section className="status">
                        MetaChess Scripture
                        <br/>
                        <br/>
                        <p>1. Protect your KING!</p>
                        <p>2. Check and CheckMates are concealed.</p>
                        <p>3. Ignorance will lose you the game or prevent you from definte wins.</p>
                        <p>4. Be smart, aware and preemptive.</p>
                        <p>5. Victory is decided only when one KING remains on the board!</p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Board