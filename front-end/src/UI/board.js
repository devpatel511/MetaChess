import React, { useState, useEffect } from 'react'; 
import Piece from '../Model/piece';
import assets from './assets';
import move from './src_chess_assets_moveSoundEffect.mp3';

function Board() {
    const [board, setBoard] = useState([]);
    const [cells, setCells] = useState([]);
    const [curr, setCurr] = useState(new Piece("", 0, ""));
    const [pos, setPos] = useState([])
    const [moves, setMoves] = useState([]);
    const [turn, setTurn] = useState(0)
    const [clicked, setClicked] = useState(false)

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
            temp.push([x, y])
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
        board[i][j] = curr
        board[pos[0]][pos[1]] = null
        DeleteMoves()
        // setBoard(board.map(b => b))
        setTurn(num => num === 0 ? 1 : 0)
        setClicked(false)
        audio.play()
    }

    const DeleteMoves = () => {
        for (const [x, y] of moves) {
            cells[x][y] = cells[x][y].slice(0, -1)
        }
        setCells(cells.map(c => c))
    }

    return (
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
    )
}

export default Board