const START_TIME = 5; // Durasi waktu pada saat baru mulai
const BONUS_TIME = 3; // Durasi perpanjangan waktu yang didapat jika memakan makanan
let timeEl;
let timeInterval;
let currentTime = START_TIME;

let playerName;
let highestScore;

var blockSize = 25;
var total_row = 17;
var total_col = 17;
var board;
var context;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var speedX = 0;
var speedY = 0;

var snakeBody = [];

var foodX;
var foodY;
var skor = 0;
var gameOver = false;

// ...

let touchStartX = 0;
let touchStartY = 0;


window.onload = function () {
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");

    timeEl = document.getElementById('time');
    timeEl.innerText = START_TIME;

    playerName = prompt('Enter Your Username: ', 'GUEST');
    highestScore = (localStorage.getItem('HIGHEST_SCORE') ?? 0);
    
    placeFood();
    document.addEventListener("keyup", changeDirection);

    setInterval(update, 2000 /  10);
}

document.addEventListener("keyup", changeDirection);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && speedX !== -1) {
            speedX = 1;
            speedY = 0;
        } else if (deltaX < 0 && speedX !== 1) {
            speedX = -1;
            speedY = 0;
        }
    } else {
        if (deltaY > 0 && speedY !== -1) {
            speedX = 0;
            speedY = 1;
        } else if (deltaY < 0 && speedY !== 1) {
            speedX = 0;
            speedY = -1;
        }
    }
    touchStartX = 0;
    touchStartY = 0;
}


function startGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    speedX = 0;
    speedY = 0;
    skor = 0;
    
    snakeBody = [];
    gameOver = false;   
    placeFood();
    setInterval(2000 / 10);
}

function update() {
    if (gameOver) {
        return startGame();
    }
    document.getElementById("skor").innerHTML = skor;
    context.fillStyle = "gray";
    context.fillRect(0,0, board.width, board.height);

    context.fillStyle = "black";
    context.fillRect(foodX,foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX,foodY]);
        placeFood();
        skor += 10;
        
        currentTime += BONUS_TIME;
        currentTime = currentTime > START_TIME ? START_TIME : currentTime;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    } 
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
    
    context.fillStyle = "white";
    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
     
    if (snakeX < 0
        || snakeX > total_col * blockSize
        || snakeY < 0
        || snakeY > total_row * blockSize ) {
        gameOver = true;
        endGame();
    }

    for(let i = 0;i < snakeBody.length; i++) {
        if(snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
            endGame();
        }
    }
}

function startTimer() {
    currentTime--;

    timeInterval = setInterval( function() {
        if(currentTime < 0) {
            gameOver = true;
            endGame();
            return false;
        }

        timeEl.innerText = currentTime;
        currentTime--;
    }, 1000);
}

function changeDirection(e) {
    if(e.code == "KeyW" && speedY != 1) {
        speedX = 0;
        speedY = -1;
    } else if (e.code == "KeyS" && speedY != -1) {
        speedX = 0;
        speedY = 1;
    } else if (e.code == "KeyA" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    } else if (e.code == "KeyD" && speedX != -1) {
        speedX = 1;
        speedY = 0;
    }

    if(!timeInterval) {
        startTimer();
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * total_col) * blockSize;

    foodY = Math.floor(Math.random() * total_row) * blockSize;
}

function endGame() {
    clearInterval(timeInterval);
    timeInterval = null;
    currentTime = START_TIME;
    timeEl.innerText = currentTime;

    if(skor > highestScore) {
        highestScore = skor;
        localStorage.setItem('HIGHEST_SCORE', highestScore);
        
        alert("NEW HIGH SCORE! USERNAME: " + playerName + " | SCORE: " + skor);
    } else {
        alert("GAME OVER " + playerName + "!, SCORE: " + skor);
    }

    // mulai game lagi ketika user menekan OK pada alert
    document.addEventListener("keydown", function(event) {
        if (event.code === "Enter") {
            startGame();
        }
    });
}