'use strict'

const GHOST = '<img src="img/ghost.png">'
var gGhosts = []
var gRemovedGhosts = []
var gColors = [100,130,185,210,250,300]

var gIntervalGhosts

var gCrazyMove = 1

function createGhosts(board) {
    // DONE: 3 ghosts and an interval
    gGhosts = []
    for (var i = 0; i < 4; i++) {
        createGhost(board)
    }
    gIntervalGhosts = setInterval(moveGhosts, 350)

}

function createGhost(board) {
    // DONE
    var ghost = {
        location: { i: 9, j: 10 },
        currCellContent: EMPTY,
        color: randomColor()
    }

    board[ghost.location.i][ghost.location.j] = getGhostHTML(ghost)
    gGhosts.push(ghost)
}

function moveGhosts() {
    // DONE: loop through ghosts
    for (var i = 0; i < gGhosts.length; i++) {
        const ghost = gGhosts[i]
        moveGhost(ghost)
    }
}

function moveGhost(ghost) {
    // DONE: figure out moveDiff, nextLocation, nextCell
    // const moveDiff = getMoveDiff()
    // const nextLocation = {
    //     i: ghost.location.i + moveDiff.i,
    //     j: ghost.location.j + moveDiff.j,
    // }
    // const nextCell = gBoard[nextLocation.i][nextLocation.j]


    var possiblePos = emptyAround(ghost.location.i,ghost.location.j)
    if (!possiblePos.length) return
 
    if (gPacman.isSuper) {
        var nextCell = farthestPosToPacman(possiblePos)
    } else {
        var nextCell = closestPosToPacman(possiblePos)
    }
    
    
    var nextCellContent = gBoard[nextCell.i][nextCell.j]

    // DONE: return if cannot move
    if (nextCellContent === PACMAN && gPacman.isSuper)return

    // DONE: hitting a pacman? call gameOver
    if (nextCellContent === PACMAN && !gPacman.isSuper) {
        gameOver()
        return
    }


    // DONE: moving from current location:
    // DONE: update the model (restore prev cell contents)
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
    // DONE: update the DOM
    renderCell(ghost.location, ghost.currCellContent)


    // DONE: Move the ghost to new location:
    // DONE: update the model (save cell contents)
    
    ghost.location = nextCell
    ghost.currCellContent = nextCellContent
    gBoard[nextCell.i][nextCell.j] = GHOST

    // DONE: update the DOM
    if (gPacman.isSuper) {
        var badGhost = {color:'50deg'}
        renderCell(ghost.location, getGhostHTML(badGhost))
    } else{
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0, j: 1 }
        case 2: return { i: 1, j: 0 }
        case 3: return { i: 0, j: -1 }
        case 4: return { i: -1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    return `<span style="filter: hue-rotate(${ghost.color})">${GHOST}</span>`
}

function randomColor() {
    // Picks a random color for ghosts
    var colorIdx = getRandomIntInclusive(0, gColors.length-1)
    var chosenColor = gColors[colorIdx]

    // Removes the color so that the color does not repeat twice on different ghosts
    gColors.splice(colorIdx,1)
   
    return chosenColor + 'deg'

}

function removeGhost(colIdx,rowIdx) {
    //Checks which ghost has been eaten and removes it from the gGhosts array
    //into a new array that will keep the ghost's information until it returns to the game

    for (let i = 0; i < gGhosts.length; i++) {
        var currGhost = gGhosts[i]

        if (colIdx === currGhost.location.i 
            && rowIdx ===currGhost.location.j) {

                //Checks if there is food under a ghost so that when Pacman eats the ghost he will also eat the food
                if (currGhost.currCellContent === FOOD) {
                gFoodCountInBoard--
                currGhost.currCellContent = EMPTY
            }

            //Removes the ghost from the array
                gRemovedGhosts.push(currGhost)
                gGhosts.splice(i,1)
        }
    }

    // If all three ghosts are eaten their movement function will stop
    if (gRemovedGhosts.length === 4) {
        clearInterval (gIntervalGhosts)
    }

}

function bringBackGhost() {
    // A function that returns all eaten ghosts back to their original array
    if (gRemovedGhosts.length === 4) {
        gIntervalGhosts = setInterval(moveGhosts, 400)
    }

    for (let i = 0; i < gRemovedGhosts.length; i++) {
        var currGhost = gRemovedGhosts[i]

        currGhost.location.i = 9
        currGhost.location.j = 10

        gGhosts.push(currGhost)
    }
    
    gRemovedGhosts = []
  
   
}

function ghostVulnerableColor() {
    // Changes the color of ghosts in super mode
    for (let i = 0; i < gGhosts.length; i++) {
        var currGhost = gGhosts[i]
        var badGhost = {color:'50deg'}
        renderCell(currGhost.location, getGhostHTML(badGhost))
    }
}

function ghostAttackModeColor() {
    // Returns ghosts to original color after super mode ends
    for (let i = 0; i < gGhosts.length; i++) {
        var currGhost = gGhosts[i]
        renderCell(currGhost.location, getGhostHTML(currGhost))
    }
}


//Functions that determine the movement of the ghosts

function emptyAround(rowIdx,colIdx) {
    //Checks the ghost movement options, up/down/right/left

    var res = []
    var possibleMove = [
        {i:rowIdx+1, j: colIdx},
        {i:rowIdx-1, j: colIdx},
        {i:rowIdx, j: colIdx+1},
        {i:rowIdx, j: colIdx-1},
    ]
    for (let i = 0; i < possibleMove.length; i++) { 
        if (possibleMove[i].j < 0 || possibleMove[i].j > gBoard[0].length-1) continue 
        else if (gBoard[possibleMove[i].i][possibleMove[i].j]=== WALL) continue 
        else if (gBoard[possibleMove[i].i][possibleMove[i].j] === GHOST) continue 
        res.push(possibleMove[i])
    }

    return res
}

function closestPosToPacman(arry) {
//A function whose purpose is to check the location of Pacman compared to the next location of the ghosts and choose the location that will bring the ghosts closer to Pacman

    var res = {i:0,j:0}
    var minDiffI = Infinity
    var minDiffJ = Infinity

    for (let i = 0; i < arry.length; i++) {
       var currPos = arry[i]  

       var currDiifI = Math.abs(gPacman.location.i - currPos.i)
       var currDiifJ = Math.abs(gPacman.location.j - currPos.j)

       if (currDiifI <= minDiffI && currDiifJ <= minDiffJ ) {
        minDiffI = currDiifI
        minDiffJ = currDiifJ
        res = {i:currPos.i,j:currPos.j}
       } 
    }
    return res
}

function farthestPosToPacman(arry) {
//A function that aims to check Pacman's location compared to the next location of the ghosts and choose the location that will keep the ghosts away from Pacman
    var res = {i:0,j:0}
    var maxDiffI = -Infinity
    var maxDiffJ = -Infinity

    for (let i = 0; i < arry.length; i++) {
       var currPos = arry[i]

       var currDiifI = Math.abs(gPacman.location.i - currPos.i)
       var currDiifJ = Math.abs(gPacman.location.j - currPos.j)

       if (currDiifI >= maxDiffI && currDiifJ >= maxDiffJ) {
        maxDiffI = currDiifI
        maxDiffJ = currDiifJ
        res = {i:currPos.i,j:currPos.j}
       }
    }
    return res
}