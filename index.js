var canvas = document.getElementById("canvaArea")
var ctx = canvas.getContext("2d")

//Create two objects
var Snake = []
Snake[0] = {
    x: 0,
    y: 0
}

var Food = []
Food[0] = {
    x: Math.floor(Math.random()*23+1) * 10,
    y: Math.floor(Math.random()*32+3) * 10
}

//Draw them
ctx.fillRect(Snake[0].x,Snake[0].y,10,10)
ctx.fillRect(Food[0].x,Food[0].y,10,10)

var speedX = 10
var speedY = 0

ctx.fillRect(Snake[0].x,Snake[0].y,10,10)

movingSnake = () => {
    ctx.clearRect(Snake[0].x,Snake[0].y,10,10)
    Snake[0].x += speedX
    Snake[0].y += speedY
    if(Snake[0].x < 0 || Snake[0].x > 291 || Snake[0].y < 0 || Snake[0].y > 291){
        ctx.fillRect(Snake[0].x-speedX,Snake[0].y-speedY,10,10)
        clearInterval(move)
        console.log('game over')
    } else {
        move
    }
    ctx.fillRect(Snake[0].x,Snake[0].y,10,10)
}


var interval = 100
var move = setInterval(movingSnake,interval)

document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowRight") {
        speedX = 10
        speedY = 0
    }
})

document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowLeft") {
        speedX = -10
        speedY = 0
    }
})

document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowDown") {
        speedX = 0
        speedY = 10
    }
})

document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowUp") {
        speedX = 0
        speedY = -10
    }
})


