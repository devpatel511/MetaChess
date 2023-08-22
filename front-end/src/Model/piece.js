class Piece {
    constructor(name, color, id) {
        this.name = name 
        this.color = color
        this.id = id
        this.options = []
        this.castle = true
        this.passant = false
    }

    moves(i, j, board) {
        this.options = []
        if (this.id === "") {
            if (this.color === 0) {
                // Capture Digonally
                if (j < 7 & board[i+1][j+1] instanceof Object) {
                    if (board[i+1][j+1].color === 1) {
                        this.options.push([i+1, j+1])
                    }
                }
                if (j > 0 & board[i+1][j-1] instanceof Object) {
                    if (board[i+1][j-1].color === 1) {
                        this.options.push([i+1, j-1])
                    }
                }
                // En-passant
                if (i === 4 & j < 7 & board[i][j+1] instanceof Object) {
                    if (board[i][j+1].passant & board[i][j+1].color === 1 & board[i][j+1].id === "") {
                        this.options.push([i+1, j+1, 1])
                    }
                }
                if (i === 4 & j > 0 & board[i][j-1] instanceof Object) {
                    if (board[i][j-1].passant & board[i][j-1].color === 1 & board[i][j-1].id === "") {
                        this.options.push([i+1, j-1, 1])
                    }
                }
                // Move forward
                if (board[i+1][j] === null) {
                    if (i === 1) {
                        if (board[i+2][j] === null) {
                            this.options.push([i+2, j])
                        }
                    }
                    this.options.push([i+1, j])
                }
            } else {
                // Capture Digonally
                if (j < 7 & board[i-1][j+1] instanceof Object) {
                    if (board[i-1][j+1].color === 0) {
                        this.options.push([i-1, j+1])
                    }
                }
                if (j > 0 & board[i-1][j-1] instanceof Object) {
                    if (board[i-1][j-1].color === 0) {
                        this.options.push([i-1, j-1])
                    }
                }
                // En-passant
                if (i === 3 & j < 7 & board[i][j+1] instanceof Object) {
                    if (board[i][j+1].passant & board[i][j+1].color === 0 & board[i][j+1].id === "") {
                        this.options.push([i-1, j+1, 2])
                    }
                }
                if (i === 3 & j > 0 & board[i][j-1] instanceof Object) {
                    if (board[i][j-1].passant & board[i][j-1].color === 0 & board[i][j-1].id === "") {
                        this.options.push([i-1, j-1, 2])
                    }
                }
                // Move forward
                if (board[i-1][j] === null) {
                    if (i === 6) {
                        if (board[i-2][j] === null) {
                            this.options.push([i-2, j])
                        }   
                    }
                    this.options.push([i-1, j])
                }
            }
        } else {
            var c = this.color === 0 ? 1 : 0
            if (this.id === "N"){
                // left-side
                if (i >= 2 & j > 0) {
                    if (board[i-2][j-1] === null) {
                        this.options.push([i-2, j-1])
                    } else {
                        if (board[i-2][j-1].color === c) {
                            this.options.push([i-2, j-1])
                        }
                    }
                }
                if (i >= 1 & j > 1) {
                    if (board[i-1][j-2] === null) {
                        this.options.push([i-1, j-2])
                    } else {
                        if (board[i-1][j-2].color === c) {
                            this.options.push([i-1, j-2])
                        }
                    }
                }
                if (i <= 6 & j > 1) {
                    if (board[i+1][j-2] === null) {
                        this.options.push([i+1, j-2])
                    } else {
                        if (board[i+1][j-2].color === c) {
                            this.options.push([i+1, j-2])
                        }
                    }
                }
                if (i <= 5 & j > 0) {
                    if (board[i+2][j-1] === null) {
                        this.options.push([i+2, j-1])
                    } else {
                        if (board[i+2][j-1].color === c) {
                            this.options.push([i+2, j-1])
                        }
                    }
                }
                // right-side
                if (i >= 2 & j < 7) {
                    if (board[i-2][j+1] === null) {
                        this.options.push([i-2, j+1])
                    } else {
                        if (board[i-2][j+1].color === c) {
                            this.options.push([i-2, j+1])
                        }
                    }
                }
                if (i >= 1 & j < 6) {
                    if (board[i-1][j+2] === null) {
                        this.options.push([i-1, j+2])
                    } else {
                        if (board[i-1][j+2].color === c) {
                            this.options.push([i-1, j+2])
                        }
                    }
                }
                if (i <= 6 & j < 6) {
                    if (board[i+1][j+2] === null) {
                        this.options.push([i+1, j+2])
                    } else {
                        if (board[i+1][j+2].color === c) {
                            this.options.push([i+1, j+2])
                        }
                    }
                }
                if (i <= 5 & j < 7) {
                    if (board[i+2][j+1] === null) {
                        this.options.push([i+2, j+1])
                    } else {
                        if (board[i+2][j+1].color === c) {
                            this.options.push([i+2, j+1])
                        }
                    }
                }
            } else if (this.id === "B") {
                // top-right
                var x = i + 1
                var y = j + 1
                while (x < 8 & y < 8) {
                    if (board[x][y] === null) {
                        this.options.push([x, y])
                        x++
                        y++
                    } else {
                        if (board[x][y].color === c) {
                            this.options.push([x, y])
                        }
                        break
                    }
                }
                // top-left
                x = i + 1
                y = j - 1
                while (x < 8 & y > -1) {
                    if (board[x][y] === null) {
                        this.options.push([x, y])
                        x++
                        y--
                    } else {
                        if (board[x][y].color === c) {
                            this.options.push([x, y])
                        }
                        break
                    }
                }
                // bottom-left
                x = i - 1
                y = j - 1
                while (x > -1 & y > -1) {
                    if (board[x][y] === null) {
                        this.options.push([x, y])
                        x--
                        y--
                    } else {
                        if (board[x][y].color === c) {
                            this.options.push([x, y])
                        }
                        break
                    }
                }
                // bottom-right
                x = i - 1
                y = j + 1
                while (x > -1 & y < 8) {
                    if (board[x][y] === null) {
                        this.options.push([x, y])
                        x--
                        y++
                    } else {
                        if (board[x][y].color === c) {
                            this.options.push([x, y])
                        }
                        break
                    }
                }
            } else if (this.id === "R") {
                // up
                x = i + 1
                while (x < 8) {
                    if (board[x][j] === null) {
                        this.options.push([x, j])
                        x++
                    } else {
                        if (board[x][j].color === c) {
                            this.options.push([x, j])
                        }
                        break
                    }
                }
                // down
                x = i - 1
                while (x > -1) {
                    if (board[x][j] === null) {
                        this.options.push([x, j])
                        x--
                    } else {
                        if (board[x][j].color === c) {
                            this.options.push([x, j])
                        }
                        break
                    }
                }
                // left
                y = j - 1
                while (y > -1) {
                    if (board[i][y] === null) {
                        this.options.push([i, y])
                        y--
                    } else {
                        if (board[i][y].color === c) {
                            this.options.push([i, y])
                        }
                        break
                    }
                }
                // right
                y = j + 1
                while (y < 8) {
                    if (board[i][y] === null) {
                        this.options.push([i, y])
                        y++
                    } else {
                        if (board[i][y].color === c) {
                            this.options.push([i, y])
                        }
                        break
                    }
                }
            } else if (this.id === "Q") {
                // up
                x = i + 1
                while (x < 8) {
                    if (board[x][j] === null) {
                        this.options.push([x, j])
                        x++
                    } else {
                        if (board[x][j].color === c) {
                            this.options.push([x, j])
                        }
                        break
                    }
                }
                // down
                x = i - 1
                while (x > -1) {
                    if (board[x][j] === null) {
                        this.options.push([x, j])
                        x--
                    } else {
                        if (board[x][j].color === c) {
                            this.options.push([x, j])
                        }
                        break
                    }
                }
                // left
                y = j - 1
                while (y > -1) {
                    if (board[i][y] === null) {
                        this.options.push([i, y])
                        y--
                    } else {
                        if (board[i][y].color === c) {
                            this.options.push([i, y])
                        }
                        break
                    }
                }
                // right
                y = j + 1
                while (y < 8) {
                    if (board[i][y] === null) {
                        this.options.push([i, y])
                        y++
                    } else {
                        if (board[i][y].color === c) {
                            this.options.push([i, y])
                        }
                        break
                    }
                }
                // top-right
                x = i + 1
                y = j + 1
                while (x < 8 & y < 8) {
                    if (board[x][y] === null) {
                        this.options.push([x, y])
                        x++
                        y++
                    } else {
                        if (board[x][y].color === c) {
                            this.options.push([x, y])
                        }
                        break
                    }
                }
                // top-left
                x = i + 1
                y = j - 1
                while (x < 8 & y > -1) {
                    if (board[x][y] === null) {
                        this.options.push([x, y])
                        x++
                        y--
                    } else {
                        if (board[x][y].color === c) {
                            this.options.push([x, y])
                        }
                        break
                    }
                }
                // bottom-left
                x = i - 1
                y = j - 1
                while (x > -1 & y > -1) {
                    if (board[x][y] === null) {
                        this.options.push([x, y])
                        x--
                        y--
                    } else {
                        if (board[x][y].color === c) {
                            this.options.push([x, y])
                        }
                        break
                    }
                }
                // bottom-right
                x = i - 1
                y = j + 1
                while (x > -1 & y < 8) {
                    if (board[x][y] === null) {
                        this.options.push([x, y])
                        x--
                        y++
                    } else {
                        if (board[x][y].color === c) {
                            this.options.push([x, y])
                        }
                        break
                    }
                }
            } else {
                if (j > 0) {
                    if (board[i][j-1] === null) {
                        this.options.push([i, j-1])
                    } else if (board[i][j-1].color === c) {
                        this.options.push([i, j-1])
                    }
                }
                if (j > 0 & i <= 6) {
                    if (board[i+1][j-1] === null) {
                        this.options.push([i+1, j-1])
                    } else if (board[i+1][j-1].color === c) {
                        this.options.push([i+1, j-1])
                    }
                }
                if (j > 0 & i >= 1) {
                    if (board[i-1][j-1] === null) {
                        this.options.push([i-1, j-1])
                    } else if (board[i-1][j-1].color === c) {
                        this.options.push([i-1, j-1])
                    }
                }
                if (i >= 1) {
                    if (board[i-1][j] === null) {
                        this.options.push([i-1, j])
                    } else if (board[i-1][j].color === c) {
                        this.options.push([i-1, j])
                    }
                }
                if (i <= 6) {
                    if (board[i+1][j] === null) {
                        this.options.push([i+1, j])
                    } else if (board[i+1][j].color === c) {
                        this.options.push([i+1, j])
                    }
                }
                if (j < 7) {
                    if (board[i][j+1] === null) {
                        this.options.push([i, j+1])
                    } else if (board[i][j+1].color === c) {
                        this.options.push([i, j+1])
                    }
                }
                if (j < 7 & i <= 6) {
                    if (board[i+1][j+1] === null) {
                        this.options.push([i+1, j+1])
                    } else if (board[i+1][j+1].color === c) {
                        this.options.push([i+1, j+1])
                    }
                }
                if (j < 7 & i >= 1) {
                    if (board[i-1][j+1] === null) {
                        this.options.push([i-1, j+1])
                    } else if (board[i-1][j+1].color === c) {
                        this.options.push([i-1, j+1])
                    }
                }
                if (this.castle) {
                    if (j === 4) {
                        if (board[i][j-1] === null & board[i][j-2] === null & board[i][j-3] === null) {
                            if (board[i][0] instanceof Object) {
                                if (board[i][0].castle & board[i][0].id === "R" & board[i][0].color === this.color) {
                                    this.options.push([i, j-2, true])
                                }
                            }
                        }
                        if (board[i][j+1] === null & board[i][j+2] === null) {
                            if (board[i][7] instanceof Object) {
                                if (board[i][7].castle & board[i][7].id === "R" & board[i][7].color === this.color) {
                                    this.options.push([i, j+2, false])
                                }
                            }
                        }
                    } else {
                        if (board[i][j-1] === null & board[i][j-2] === null) {
                            if (board[i][0] instanceof Object) {
                                if (board[i][0].castle & board[i][0].id === "R" & board[i][0].color === this.color) {
                                    this.options.push([i, j-2, true])
                                }
                            }
                        }
                        if (board[i][j+1] === null & board[i][j+2] === null & board[i][j+3] === null) {
                            if (board[i][7] instanceof Object) {
                                if (board[i][7].castle & board[i][7].id === "R" & board[i][7].color === this.color) {
                                    this.options.push([i, j+2, false])
                                }
                            }
                        }
                    }
                }
            }
        }
    } 
}

export default Piece