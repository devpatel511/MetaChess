import React, { useState, useEffect } from 'react'; 
import Piece from '../Model/piece'
import assets from './assets';
import move from './src_chess_assets_moveSoundEffect.mp3';
import { useNavigate } from 'react-router-dom';

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

    const audio = new Audio(move);
    var isGreyCell = false;

    useEffect(() => {
        CreateCells();
        CreateBoard();
    }, [])

    const CreateCells = () => {
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

    const CreateBoard = () => {
        const backRank = ["Rook", "Nknight", "Bishop", "Queen", "King", "Bishop", "Nknight", "Rook"]
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
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        if (board[i][j] instanceof Object) {
            const p = board[i][j]
            if (p.color === turn & cells[7-i][j+1].length <= 2) {
                return true
            }
            return false
        }
        return false
    }

    const GetPiece = (prop) => {
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        return assets[board[i][j].name][board[i][j].color];
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

    const Move = (prop) => {
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        if (IsPiece(prop)) {
            if (board[i][j].id === "K") {
                setGameOver(true)
                if (turn === 0) {
                    setTurn(2)
                } else {
                    setTurn(3)
                }
            }
        }
        board[i][j] = curr
        if (PawnLastRow(prop)) {
            Popup(prop)
        }
        board[pos[0]][pos[1]] = null
        DeleteMoves(j)
        setBoard(board.map(b => b))
        setTurn(num => num === 0 ? 1 : (num !== 1 ? num : 0))
        setClicked(false)
        for (const p of passants) {
            p.passant = false
        }
        setPassants([])
        if (curr.id === "") {
            if (curr.castle & curr.color === 0 & i === 3) {
                curr.passant = true
                setPassants([...passants, curr])
            } else if (curr.castle & curr.color === 1 & i === 4) {
                curr.passant = true
                setPassants([...passants, curr])
            }
        }
        curr.castle = false
        audio.play()
    }

    const DeleteMoves = (j) => {
        for (let k=0; k<moves.length; k++) {
            const x = moves[k][0]
            const y = moves[k][1]
            cells[x][y] = cells[x][y].slice(0, -1)
            if (moves[k].length > 2) {
                const temp = moves[k][2]
                if (temp === 1 & j === y-1) {
                    board[6-x][y-1] = null
                } else if (temp === 2 & j === y-1) {
                    board[8-x][y-1] = null
                } else if (temp & j === 2) {
                    board[7-x][y] = board[7-x][0]
                    board[7-x][0] = null
                } else if (!temp & j === 6) {
                    board[7-x][y-2] = board[7-x][7]
                    board[7-x][7] = null
                }
            }
        }
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
                                    <button onClick={() => navigate("/")}>Exit</button>
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
                                <img className='pieceAdv' src={assets["Queen"][color]} alt=""></img>
                            </div>
                            <div className={"choices grey "} onClick={() => Swap(color, "Nknight")}>
                                <img className='pieceAdv' src={assets["Nknight"][color]} alt=""></img>
                            </div>
                            <div className={"choices grey "} onClick={() => Swap(color, "Rook")}>
                                <img className='pieceAdv' src={assets["Rook"][color]} alt=""></img>
                            </div>
                            <div className="choices" onClick={() => Swap(color, "Bishop")}>
                                <img className='pieceAdv' src={assets["Bishop"][color]} alt=""></img>
                            </div>
                        </div>
                    </div>
                ) : ""}

                <div className="file"></div>
                <div className="file">a</div>
                <div className="file">b</div>
                <div className="file">c</div>
                <div className="file">d</div>
                <div className="file">e</div>
                <div className="file">f</div>
                <div className="file">g</div>
                <div className="file">h</div>
            </div>
            <div className='match'>
                <div className="game__meta snipcss-sobXV">
                    <section>
                        <div className="game__meta__infos" data-icon="">
                        <div>
                            <div className="header">
                            <div className="setup">
                                +0 / -0
                            </div>
                            <time className="set" datetime="2023-08-17T02:09:19.031Z" title="Aug 16, 2023, 10:09 PM">
                                Local
                            </time>
                            </div>
                        </div>
                        </div>
                        <div className="game__meta__players">
                        <div className="player color-icon is white text">
                            <span className="user-link">
                            Anonymous <span className='elo-num'>&nbsp;400</span>
                            </span>
                        </div>
                        <div className="player color-icon is black text">
                            <span className="user-link">
                            Anonymous <span className='elo-num'>&nbsp;400</span>
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