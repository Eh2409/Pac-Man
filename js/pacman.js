'use strict'

const PACMAN = '<img src="img/pacman.gif">'
var gPacman

function createPacman(board) {
    // DONE: initialize gPacman...
    gPacman = {
        location: { i: 3, j: 10 },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN

    // Due to adding Pacman to the board, the food is reduced by one
    gFoodCountInBoard--
}

function onMovePacman(ev) {
    if (!gGame.isOn) return
    // DONE: use getNextLocation(), nextCell
    const nextLocation = getNextLocation(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // DONE: return if cannot move
    if (nextCell === WALL) return

    // DONE: hitting a ghost? call gameOver
    if (nextCell === GHOST && !gPacman.isSuper) {
        gameOver()
        return
    } else if (nextCell === GHOST && gPacman.isSuper){
        updateScore(200)

        // In super mode Pacman eats the ghosts
        removeGhost(nextLocation.i,nextLocation.j)
    }


    if (nextCell === FOOD){
         updateScore(1)

         //Updates the amount of food left on the board
         gFoodCountInBoard--

         //If there is no more food on the board, a victory function is activated
         if (!gFoodCountInBoard) {
           console.log('win');
           victory()
         }
    }


    if (nextCell === SUPER_FOOD && !gPacman.isSuper){
        updateScore(2)

        // Super mode is on
        gPacman.isSuper = true

        //Changes the color of the ghosts
        ghostVulnerableColor()

        
        // /A timer that cancels super mode
        setTimeout(() => {
        gPacman.isSuper = false

        // Returns the ghosts to their original color
        ghostAttackModeColor()

        // If a ghost is eaten, the function will return it to the board
        if (gRemovedGhosts.length && gGame.isOn) {
            setTimeout (bringBackGhost,1000)
        }},5000) 

   } else if (nextCell === SUPER_FOOD) {
    return
   }

   if (nextCell === CHERRY){
    updateScore(100)
   }

    // DONE: moving from current location:
    // DONE: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // DONE: update the DOM
    renderCell(gPacman.location, EMPTY)


    // DONE: Move the pacman to new location:
    // DONE: update the model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    gPacman.location = nextLocation
    // DONE: update the DOM
    renderCell(gPacman.location, getPacmanHTML(gPacman.deg))
}

function getNextLocation(eventKeyboard) {

    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    // DONE: figure out nextLocation
    switch (eventKeyboard) {
        case 'ArrowUp':
            gPacman.deg = -90
            nextLocation.i--
            break;
        case 'ArrowRight':
            gPacman.deg = 0
            nextLocation.j++
            break;
        case 'ArrowDown':
            gPacman.deg = 90
            nextLocation.i++
            break;
        case 'ArrowLeft':
            gPacman.deg = 180
            nextLocation.j--
            break;
    }
    return nextLocation
}

function getPacmanHTML(deg) {
    // Defines the image of Pacman inside a div with a style that allows the DOM to change the direction of Pacman
    return `<div style="transform: rotate(${deg}deg);">${PACMAN}</div>`
}