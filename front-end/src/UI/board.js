import React, { useState, useEffect } from 'react'; 
import Piece from '../Model/piece';
import assets from './assets';

function Board() {
    const [board, setBoard] = useState([]);
    const [cells, setCells] = useState([]);

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

    return (
        <div class="board">
            {cells.map(cell => (
                cell.map(square => (
                    IsRank(square) ? 
                        <div class="rank">{square}</div> : 
                        <div class={"gamecell " + (isGreyCell ? "grey" : "")}>
                            {toggle(square)}
                            {IsPiece(square) ? <img class="piece" src={GetPiece(square)} alt=""></img>: ''}
                        </div>
                ))
            ))}
            {/* <div class="rank">8</div>
            <div class="gamecell" id="7_0">
                {IsPiece("70") ? (<img class="piece" src={GetPiece("70")}></img>) : ''}
            </div>
            <div class="gamecell grey" id="7_1">
                {IsPiece("71") ? (<img class="piece" src={GetPiece("71")}></img>) : ''}
            </div>
            <div class="gamecell" id="7_2">
                {IsPiece("72") ? (<img class="piece" src={GetPiece("72")}></img>) : ''}
            </div>
            <div class="gamecell grey" id="7_3">
                {IsPiece("73") ? (<img class="piece" src={GetPiece("73")}></img>) : ''}
            </div>
            <div class="gamecell" id="5_8">
                {IsPiece("74") ? (<img class="piece" src={GetPiece("74")}></img>) : ''}
            </div>
            <div class="gamecell grey" id="6_8">
                {IsPiece("75") ? (<img class="piece" src={GetPiece("75")}></img>) : ''}
            </div>
            <div class="gamecell" id="7_8">
                {IsPiece("76") ? (<img class="piece" src={GetPiece("76")}></img>) : ''}
            </div>
            <div class="gamecell grey" id="8_8">
                {IsPiece("77") ? (<img class="piece" src={GetPiece("77")}></img>) : ''}
            </div> 

            <div class="rank">7</div>
            <div class="gamecell grey" id="1_8">
                {IsPiece("60") ? (<img class="piece" src={GetPiece("60")}></img>) : ''}
            </div>
            <div class="gamecell" id="2_8">
                {IsPiece("61") ? (<img class="piece" src={GetPiece("61")}></img>) : ''}
            </div>
            <div class="gamecell grey" id="3_8">
                {IsPiece("62") ? (<img class="piece" src={GetPiece("62")}></img>) : ''}
            </div>
            <div class="gamecell" id="4_8">
                {IsPiece("63") ? (<img class="piece" src={GetPiece("63")}></img>) : ''}
            </div>
            <div class="gamecell grey" id="5_8">
                {IsPiece("64") ? (<img class="piece" src={GetPiece("64")}></img>) : ''}
            </div>
            <div class="gamecell" id="6_8">
                {IsPiece("65") ? (<img class="piece" src={GetPiece("65")}></img>) : ''}
            </div>
            <div class="gamecell grey" id="7_8">
                {IsPiece("66") ? (<img class="piece" src={GetPiece("66")}></img>) : ''}
            </div>
            <div class="gamecell" id="8_8">
                {IsPiece("67") ? (<img class="piece" src={GetPiece("67")}></img>) : ''}
            </div> 

            <div class="rank">6</div>
            <div class="gamecell" id="1_6"></div>
            <div class="gamecell grey" id="2_6"></div>
            <div class="gamecell" id="3_6"></div>
            <div class="gamecell grey" id="4_6"></div>
            <div class="gamecell" id="5_6"></div>
            <div class="gamecell grey" id="6_6"></div>
            <div class="gamecell" id="7_6"></div>
            <div class="gamecell grey" id="8_6"></div>

            <div class="rank">5</div>
            <div class="gamecell grey" id="1_5"></div>
            <div class="gamecell" id="2_5"></div>
            <div class="gamecell grey" id="3_5"></div>
            <div class="gamecell" id="4_5"></div>
            <div class="gamecell grey" id="5_5"></div>
            <div class="gamecell" id="6_5"></div>
            <div class="gamecell grey" id="7_5"></div>
            <div class="gamecell" id="8_5"></div>

            <div class="rank">4</div>
            <div class="gamecell" id="1_4"></div>
            <div class="gamecell grey" id="2_4"></div>
            <div class="gamecell" id="3_4"></div>
            <div class="gamecell grey" id="4_4"></div>
            <div class="gamecell" id="5_4"></div>
            <div class="gamecell grey" id="6_4"></div>
            <div class="gamecell" id="7_4"></div>
            <div class="gamecell grey" id="8_4"></div>

            <div class="rank">3</div>
            <div class="gamecell grey" id="1_3"></div>
            <div class="gamecell" id="2_3"></div>
            <div class="gamecell grey" id="3_3"></div>
            <div class="gamecell" id="4_3"></div>
            <div class="gamecell grey" id="5_3"></div>
            <div class="gamecell" id="6_3"></div>
            <div class="gamecell grey" id="7_3"></div>
            <div class="gamecell" id="8_3"></div>

            <div class="rank">2</div>
            <div class="gamecell" id="1_2"></div>
            <div class="gamecell grey" id="2_2"></div>
            <div class="gamecell" id="3_2"></div>
            <div class="gamecell grey" id="4_2"></div>
            <div class="gamecell" id="5_2"></div>
            <div class="gamecell grey" id="6_2"></div>
            <div class="gamecell" id="7_2"></div>
            <div class="gamecell grey" id="8_2"></div>

            <div class="rank">1</div>
            <div class="gamecell grey" id="1_1"></div>
            <div class="gamecell" id="2_1"></div>
            <div class="gamecell grey" id="3_1"></div>
            <div class="gamecell" id="4_1"></div>
            <div class="gamecell grey" id="5_1"></div>
            <div class="gamecell" id="6_1"></div>
            <div class="gamecell grey" id="7_1"></div>
            <div class="gamecell" id="8_1"></div> */}

            <div class="file"></div>
            <div class="file">a</div>
            <div class="file">b</div>
            <div class="file">c</div>
            <div class="file">d</div>
            <div class="file">e</div>
            <div class="file">f</div>
            <div class="file">g</div>
            <div class="file">h</div>
        </div>
    )
}

export default Board