'use strict'

const WALL = '<img src="img/wall.png">' 
const FOOD = '⚾'
const SUPER_FOOD = '<img src="img/power.gif">'
const CHERRY = '<img src="img/cherry.png">'
const EMPTY = ' '
const GHOST_BASE = ' '

const gGame = {
    score: 0,
    isOn: false
}

var gBoard
var gFoodCountInBoard = 0
var gCherry

function onInit() {
    const elGameOver = document.querySelector('.end-screen')
    elGameOver.classList.add('hide')
    
    updateScore(0)
    gBoard = buildBoard()

    addAndCountFoodOnTheBoard(gBoard)

    gColors = [100,130,185,210,250,300]

    createGhosts(gBoard)
    createPacman(gBoard)

    renderBoard(gBoard)
    gGame.isOn = true

    gCherry = setInterval (addRandomCherry,30000)
}

function buildBoard() {
    const colSize = 21
    const rowSize = 21
    const board = []

    for (var i = 0; i < colSize; i++) {
        board.push([])

        for (var j = 0; j < rowSize; j++) {

            if (i === 0 || i === colSize - 1 ||
                j === 0 || j === rowSize - 1 ) {
                board[i][j] = WALL
            }

            if (i===17 && j===1 || i===17 && j===19 ||
                i===5 && j===1 || i===5 && j===19) {
                board[i][j] = SUPER_FOOD
            }   
            
            if (i === 7 && j >= 7 &&  j <= 13 ||
                i === 8 && j >= 7 &&  j <= 13 ||
                i === 9 && j >= 7 &&  j <= 13 ||
                i === 10 && j >= 7 &&  j <= 13 ||
                i === 11 && j >= 7 &&  j <= 13 
            ){
                board[i][j] = GHOST_BASE
            }
        
        }

        creatBoardObstacleWall(board)
       
    }
    return board
}

function creatBoardObstacleWall(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            
            if (i === 10 && j >= 8 &&  j <= 9 || 
                i === 10 && j >= 11 &&  j <= 12 || 
                j === 8 && i >= 8 &&  i <= 9  ||
                j === 12 && i >= 8 &&  i <= 9 ||
                i === 8 && j === 9 || i === 8 && j === 11 
            ) {
                board[i][j] = WALL
            }

            if (i === 4 && j >= 8 &&  j <= 12 || 
                 j === 10 && i >= 5 && i <= 6 ||
                 j === 10 && i >= 1 && i <= 2
               ) {
                board[i][j] = WALL
            }

            if (i === 12 && j >= 8 &&  j <= 12 || 
                j === 10 && i >= 13 && i <= 14
               ) {
                board[i][j] = WALL
            }

            if (i === 16 && j >= 8 &&  j <= 12 || 
                j === 10 && i >= 17 && i <= 18
               ) {
                board[i][j] = WALL
            }
            
            if ( j === 6 && i >= 4 && i <= 8 ||
                j === 14 && i >= 4 && i <= 8 ||
                i === 6 && j >= 7 && j <= 8 ||
                i === 6 && j >= 12 && j <= 13 ||
                j === 6 && i >= 10 && i <= 12 ||
                j === 14 && i >= 10 && i <= 12 
            ) {
                board[i][j] = WALL
            }

            if ( j === 6 && i >= 16 && i <= 18 ||
                j === 14 && i >= 16 && i <= 18 ||
                i === 18 && j >= 2 && j <= 8 ||
                i === 18 && j >= 12 && j <= 18  ||
                i === 14 && j >= 6 && j <= 8 ||
                i === 14 && j >= 12 && j <= 14 
            ) {
                board[i][j] = WALL
            }

            if ( i === 14 && j >= 2 && j <= 4 ||
                i === 14 && j >= 16 && j <= 18 ||
                j === 4 && i >= 15 && i <= 16 ||
                j === 16 && i >= 15 && i <= 16 ||
                i === 16 && j >= 1 && j <= 2 ||
                i === 16 && j >= 18 && j <= 19 
            ) {
                board[i][j] = WALL
            }

            if ( i === 2 && j >= 2 && j <= 4 ||
                i === 2 && j >= 6 && j <= 8 ||
                i === 2 && j >= 12 && j <= 14 ||
                i === 2 && j >= 16 && j <= 18 
            ) {
                board[i][j] = WALL
            }

            if ( i === 4 && j >= 2 && j <= 4 ||
                i === 4 && j >= 16 && j <= 18 ||
                i === 5 && j >= 2 && j <= 4 ||
                i === 5 && j >= 16 && j <= 18 ||
                i === 6 && j >= 2 && j <= 4 ||
                i === 6 && j >= 16 && j <= 18 
            ) {
                board[i][j] = WALL
            }

            if ( i === 8 && j === 2 ||
                i === 8 && j === 18 ||
                i === 12 && j === 4 ||
                i === 12 && j === 16 ||
                i === 10 && j >= 2 && j <= 4 ||
                i === 10 && j >= 16 && j <= 18 ||
                j === 4 && i >= 8 && i <= 9 ||
                j === 16 && i >= 8 && i <= 9 ||
                j === 2 && i >= 11 && i <= 12 ||
                j === 18 && i >= 11 && i <= 12
            ) {
                board[i][j] = WALL
            }

        }
    }

  
}

function addAndCountFoodOnTheBoard(board) {
    gFoodCountInBoard = 0
    for (let i = 0; i < board.length -1; i++) {
        for (let j = 0; j < board[0].length; j++) {
           if (!board[i][j]) {
            board[i][j] = FOOD
            gFoodCountInBoard++
           }
        }  
    }
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}" title="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML

    
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
    // DONE: update model
    if (diff) {
        gGame.score += diff
    } else {
        gGame.score = 0
    }
    // DONE and dom
    document.querySelector('span.score').innerText = gGame.score
}

function gameOver() {
    console.log('Game Over')
    // TODO
    clearInterval(gIntervalGhosts)
    clearInterval(gCherry)
    renderCell(gPacman.location, '<img src="img/hurt.png">' )
    gGame.isOn = false

    //Shows a model of a restart button
    const elGameOver = document.querySelector('.end-screen')
    const elResult = elGameOver.querySelector('p')
    elResult.innerText = 'game over'
    elGameOver.classList.remove('hide')
    
}

function victory() {
    console.log('victory')
    // TODO
    clearInterval(gIntervalGhosts)
    clearInterval(gCherry)
    gGame.isOn = false

    //Shows a model of a restart button
    const elGameOver = document.querySelector('.end-screen')
    const elResult = elGameOver.querySelector('p')
    elResult.innerText = 'victory'
    elGameOver.classList.remove('hide')
    
}

function ChecksForEmptySpace() {
    // Searches for empty cells in the board and returns an array
    var res = []
    for (let i = 0; i < gBoard.length  ; i++) {
         for (let j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === EMPTY){
                var currCell = {i: i, j: j}
                res.push(currCell)
            }
        }
    }
    return res
}

function addRandomCherry() {
    // Looking for a random cell
    var emptyCells = ChecksForEmptySpace()
    if (!emptyCells.length) return
    var randomCell = getRandomIntInclusive(0, emptyCells.length-1)
    var theChosenCell = emptyCells[randomCell]

    // Updates the board
    gBoard[theChosenCell.i][theChosenCell.j] = CHERRY
    //Updates the DOM
    renderCell(theChosenCell,CHERRY)
}