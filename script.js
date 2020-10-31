const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'

const WINNING_COMBINATIONS = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6]
]

const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')

let circleTurn

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
   circleTurn = false
   cellElements.forEach(cell => {
      cell.classList.remove(X_CLASS)
      cell.classList.remove(CIRCLE_CLASS)
      cell.removeEventListener('click', handleClick)
      cell.addEventListener('click', handleClick, {once: true})
   })
   setBoardHoverClass()
   winningMessageElement.classList.remove('show')
}

function handleClick(e) {
   const cell = e.target
   const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
   //placeMark
   placeMark(cell, currentClass)

   //Check for Win
   //Check for Draw
   //Switch Turns
   if(checkWin(currentClass)) {
      endGame(false)
   } else if(isDraw()) {
      endGame(true)
   } else {
      swapTurns()
      setBoardHoverClass()
   }
}

function endGame(draw) {
   if(draw) {
      winningMessageTextElement.innerText = 'Draw!'
   } else {
      winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
      updateScore(circleTurn ? 'p2Name' : 'p1Name');
   }
   winningMessageElement.classList.add('show')
}

function isDraw() {
   return [...cellElements].every(cell => {
      return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
   })
}

function placeMark(cell, currentClass) {
   cell.classList.add(currentClass)
}

function swapTurns() {
   circleTurn = !circleTurn
}

function setBoardHoverClass() {
   board.classList.remove(X_CLASS)
   board.classList.remove(CIRCLE_CLASS)
   if(circleTurn) {
      board.classList.add(CIRCLE_CLASS)
   } else {
      board.classList.add(X_CLASS)
   }
}

function checkWin(currentClass) {
   return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => {
         return cellElements[index].classList.contains(currentClass)
      })
   })
}


//For adding user data and keeping scores

const BASE_URL = 'https://crudcrud.com/api/2dca93397b624f81ac8b73c303b3b39e';

class User {
   constructor(name, score) {
      this.name = name;
      this.score = score;
   }
}

async function checkUser(pName) {
   var name = document.getElementById(pName).value;
   var a = await axios 
   .get(`${BASE_URL}/users`)
   .then((res) => {
      var playerData = res.data;
      var playerExist = false;
      console.log('response', res)
      playerData.forEach(player => {
         console.log('printing username', player.user, name);
         if(player.user==name){
            console.log('tag name', pName)
            if(pName=='p1Name'){
               console.log('score', player.score)
               showOutput(player.score, 'p1Score')
            }else{
               showOutput(player.score, 'p2Score')
            }
            playerExist = true;
         }
      })
      console.log(a)
      if(!playerExist){
         axios
         .post(`${BASE_URL}/users`, {
         "user":name,
         "score": 0
         })
         console.log(res.data)
         if(pName==='p1Name'){
            showOutput(0, 'p1Score')
         }else{
            showOutput(0, 'p2Score')
         }
      }
      
   })
   .catch((err) => {
      console.log(err)
   })
}

function showOutput(score, pid) {
   var div = document.getElementById(pid);
   div.innerHTML = score;
}

async function updateScore(pName) {
   var name = document.getElementById(pName).value;
   var plyr_id, plyr_s;
   await axios 
   .get(`${BASE_URL}/users`)
   .then((res) => {
      var playerData = res.data;
      playerData.forEach(player => {
         console.log(player.user, name);
         if(player.user==name){
            plyr_s = player.score + 1;
            plyr_id = player._id;
            if(pName=='p1Name'){
               showOutput(player.score, 'p1Score')
            }else{
               showOutput(player.score, 'p2Score')
            }
         }
      })
      axios
      .put(`${BASE_URL}/users/${plyr_id}`, {
         "user":name,
         "score": plyr_s
         })
   })
}