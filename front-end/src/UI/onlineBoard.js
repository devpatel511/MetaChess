import React, { useState, useEffect, useRef } from 'react'; 
import Piece from '../Model/piece'
import assets from './assets';
import sound from './src_chess_assets_moveSoundEffect.mp3';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Spinner, ChakraProvider, extendTheme, Stack, Text } from '@chakra-ui/react'

const theme = extendTheme({
    styles: {
      global: () => ({ 
        body: {
          fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
          color: "#EEE",
          bg: "",
          transitionProperty: "",
          transitionDuration: "",
          lineHeight: "",
        },
      }),
    },
    components: {
        Spinner,
        Stack,
        Text
    }
  });

var socket = io.connect(process.env.REACT_APP_SOCKET_BASE);;
const API_BASE = process.env.REACT_APP_API_BASE + "/game/online/";

function OnlineBoard() {
    const [board, setBoard] = useState([]);
    const [cells, setCells] = useState([]);
    const [curr, setCurr] = useState(new Piece("", 0, ""));
    const [pos, setPos] = useState([])
    const [moves, setMoves] = useState([]);
    const [turn, setTurn] = useState(0)
    const [clicked, setClicked] = useState(false)
    const [passants, setPassants] = useState([])
    const [popupActive, setPopupActive] = useState(false)
    const [squareNew, setSquare] = useState("")
    const [gameOver, setGameOver] = useState(false)
    const { userId } = useParams();
    const navigate = useNavigate();
    const [recv, setRecv] = useState(true);
    const [letters, setLetters] = useState(["a", "b", "c", "d", "e", "f", "g", "h"]);
    const [move, setMove] = useState(0);
    const [room, setRoom] = useState("");
    const [foe, setFoe] = useState("");
    const [userElo, setUserElo] = useState(0);
    const [foeElo, setFoeElo] = useState(0);

    const audio = new Audio(sound);
    var isGreyCell = false;
    var fetchExecuted = useRef(false);

    useEffect(() => {
        socket.emit("join_room");
    }, []);

    useEffect(() => {
        socket.on("foe_name", (datoid) => {
            setFoe(datoid.name);
            fetch(process.env.REACT_APP_API_BASE + "/user/elo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user1: userId,
                    user2: datoid.name,
                }) })
                .then(res => res.json())
                .then(data => {
                        setUserElo(data.user1); 
                        setFoeElo(data.user2);
                    })
                .catch(err => console.error("Error: ", err));
        })

        socket.on("receive_message", (data) => {
            socket.emit("get_user", { name: userId, room: data.room })
            setMove(data.color);
            setRoom(data.room);
            if (data.color === 1) {
              setLetters(letters.slice().reverse());
            }
            CreateCells(data.color);
            CreateBoard(data.color);
            setRecv(false);
          });
        
        socket.on("move", async (data) => {
            if (data.id !== socket.id) {
                try {
                    if (board[data.i][data.j] instanceof Object) {
                        if (board[data.i][data.j].id === "K") {
                            setGameOver(true)
                            socket.emit("disconnectMe");
                            board[data.i][data.j] = await board[data.x][data.y];
                            board[data.x][data.y] = null;
                            await setBoard(board.map((b) => [...b]));
                            if (move === 1) {
                                await setTurn(4)
                            } else {
                                await setTurn(3)
                            }
                            if (!fetchExecuted.current) {
                                fetchExecuted.current = true;
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
                            return;
                        } 
                    }
                    board[data.i][data.j] = await board[data.x][data.y];
                    board[data.x][data.y] = null;
                    await setBoard(board.map((b) => [...b]));
                    if (data.passant) {
                        board[data.i][data.j].passant = true;
                        setPassants([[...passants, board[data.i][data.j]]]);
                    }
                    if (data.ret >= 3) {
                        board[data.i+1][data.j] = null;
                    } else if (data.ret === 1 || data.ret === 2) {
                        if (move === 0) {
                            if (data.ret === 1) {
                                board[7][5] = await board[7][7];
                                board[7][7] = null;
                            } else {
                                board[7][3] = await board[7][0];
                                board[7][0] = null;
                            }
                        } else {
                            if (data.ret === 1) {
                                board[7][4] = await board[7][7];
                                board[7][7] = null;
                            } else {
                                board[7][2] = await board[7][0];
                                board[7][0] = null;
                            }
                        }
                    }
                    await setTurn(move);
                    await setBoard(board.map((b) => [...b]));
                } catch (error) {
                    // console.log(error)
                }
            }
        })

        socket.on("swap", async (data) => {
            if (data.id !== socket.id) {
                try {
                    board[data.i][data.j] = await new Piece(data.name, 1, data.name.charAt(0));
                    setBoard(board.map((b) => [...b]));
                } catch (error) {
                    // console.log(error)
                }
            }
        })
    }, [letters, move, board, turn, passants, userId]);

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

    const Move = async (prop) => {
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        var flag = true
        if (IsPiece(prop)) {
            if (board[i][j].id === "K") {
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
                flag = false
                setGameOver(true)
                if (turn === 0) {
                    setTurn(2)
                } else {
                    setTurn(3)
                }
            } 
        }
        board[i][j] = curr
        if (flag && PawnLastRow(prop)) {
            Popup(prop)
        }
        board[pos[0]][pos[1]] = null
        const ret = DeleteMoves(j)
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
        socket.emit("move", { room: room, id: socket.id, passant: curr.passant, i: 7-i, j: 7-j, x: 7-pos[0], y: 7-pos[1], ret: ret })
        if (!flag) {
            socket.emit("disconnectMe");
        }
    }

    const DeleteMoves = (j) => {
        var ret = 0;
        for (let k=0; k<moves.length; k++) {
            const x = moves[k][0]
            const y = moves[k][1]
            cells[x][y] = cells[x][y].slice(0, -1)
            if (moves[k].length > 2) {
                const temp = moves[k][2]
                if (temp === 1 & j === y-1) {
                    board[6-x][y-1] = null
                    ret = 3;
                } else if (temp === 2 & j === y-1) {
                    board[8-x][y-1] = null
                    ret = 4;
                } else if (move === 0 && temp & j === 2) {
                    board[7-x][y] = board[7-x][0]
                    board[7-x][0] = null
                    ret = 1;
                } else if (move === 0 && !temp & j === 6) {
                    board[7-x][y-2] = board[7-x][7]
                    board[7-x][7] = null
                    ret = 2;
                } else if (move === 1 && temp & j === 1) {
                    board[7-x][y] = board[7-x][0]
                    board[7-x][0] = null
                    ret = 1;
                } else if (move === 1 && !temp & j === 5) {
                    board[7-x][y-2] = board[7-x][7]
                    board[7-x][7] = null
                    ret = 2;
                } 
            }
        }
        setCells(cells.map(c => c))
        return ret;
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
    }

    const Swap = (name) => {
        setPopupActive(false)
        const i = squareNew.charAt(0)
        const j = squareNew.charAt(1)
        board[i][j] = new Piece(name, 0, name.charAt(0))
        socket.emit("swap", { i: 7-i, j: 7-j, name: name, id: socket.id, room: room });
    }

    return (
        <div>
            {recv ? (
                <div className='centered'>
                    <ChakraProvider theme={theme}>
                        <Stack direction="row" spacing={4}>
                            <Text fontSize="2xl" fontWeight="bold">Searching for Player</Text>
                            <Spinner 
                                thickness='1.5px'
                                color='#12d77e'
                                size='xl'
                            />
                        </Stack>
                    </ChakraProvider>
                </div>
            ) : (<div className='bird-box'><div className="board">
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
                        <div className="choices" onClick={() => Swap("Queen")}>
                            <img className='pieceAdv' src={assets["Queen"][move]} alt=""></img>
                        </div>
                        <div className={"choices grey "} onClick={() => Swap("Nknight")}>
                            <img className='pieceAdv' src={assets["Nknight"][move]} alt=""></img>
                        </div>
                        <div className={"choices grey "} onClick={() => Swap("Rook")}>
                            <img className='pieceAdv' src={assets["Rook"][move]} alt=""></img>
                        </div>
                        <div className="choices" onClick={() => Swap("Bishop")}>
                            <img className='pieceAdv' src={assets["Bishop"][move]} alt=""></img>
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
                    <div className="game__meta__infos" data-icon="">
                    <div>
                        <div className="header">
                        <div className="setup">
                            +50 / -50
                        </div>
                        <time className="set" datetime="2023-08-17T02:09:19.031Z" title="Aug 16, 2023, 10:09 PM">
                            Online
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
                                    {foe} <span className='elo-num'>&nbsp;{foeElo}</span> 
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
                                    {foe} <span className='elo-num'>&nbsp;{foeElo}</span> 
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
        )}
        </div>
    )
}

export default OnlineBoard