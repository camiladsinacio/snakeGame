const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score"); //related to score++
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");//controls the icon buttons 
// querySelectorAll() method returns all elements that matches a CSS selector

let gameOver = false;
let foodX, foodY;
let snakeX = 10, snakeY = 10;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

//Get the value of the specified local storage item
let highScore = localStorage.getItem("high-score") || 0; //it will get the saved info and collect in local storage aboute the scores

highScoreElement.innerText = `High Score: ${highScore}`; //prints on the screen

const updateFoodPosition = () => {  //Arrow functions allow us to write shorter function syntax
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    // creates a random positiom to the food in the grid 30x30
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload(); //Reload the current document
}

const changeDirection = velocity => { //it's related to the keyboard
    // Changing velocity value based on key press
    if(velocity.key === "ArrowUp" && velocityY != 1) { //1 restricts snake chage directions to the oposite side
        velocityX = 0;
        velocityY = -1;
    } else if(velocity.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(velocity.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(velocity.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

//changing snake direction with icon buttons
// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    // 1º creating a food div and inserting in the boardgame element

    // Checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY) { //changes food position when snake and food are in the same place
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Add a new item to array snakeBody
        score++; // increment score by 1
        highScore = score >= highScore ? score : highScore; //high score to score value is greater than high score, then do the localStorage below
        localStorage.setItem("high-score", highScore); //saving the info with the score name
        scoreElement.innerText = `Score: ${score}`; //print the score increasing
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) { 
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {//creates a body with the snakeBody array positions
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true; //if the snake hits it's own body
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100); // the head moves every 100 miliseconds
document.addEventListener("keyup", changeDirection);