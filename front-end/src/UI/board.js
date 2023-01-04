import React, { useState, useEffect } from 'react'; 
import Piece from '../Model/piece';
import assets from './assets';
import move from './src_chess_assets_moveSoundEffect.mp3';

function Board() {
    const [board, setBoard] = useState([]);
    const [cells, setCells] = useState([]);

    var isGreyCell = false;
    const audio = new Audio(move);

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
                temp[i].push(false)
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
        const i = parseInt(prop.charAt(0))
        const j = parseInt(prop.charAt(1))
        const p = board[i][j]
        if (p.id === "N" & p.color === 0) {
            cells[7-i-2][j+2] += "1"
            cells[7-i-2][j] += "1"
            setCells(cells.map(cell => cell))
        }
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

    const Move = () => {
        board[2][5] = board[0][6]
        board[0][6] = false
        audio.play()
        setBoard(board.map(b => b))
    }

    return (
        <div className="board">
            {cells.map(cell => (
                cell.map(square => (
                    IsRank(square) ? 
                        <div className="rank" key={square}>{square}</div> : 
                        <div className={"gamecell " + (isGreyCell ? "grey " : "") + (IsPiece(square) ? "ocup ": "") + (IsGreen(square) ? "green " : "")} 
                            key={square} onClick={IsPiece(square) ? (() => Options(square)) : (IsGreen(square) ? (() => Move()): null)}>
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