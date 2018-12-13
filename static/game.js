// Biggest thanks to this guy: https://hackernoon.com/how-to-build-a-multiplayer-browser-game-4a793818c29b
//and this guy who answered: https://stackoverflow.com/questions/31106189/create-a-simple-10-second-countdown
var socket = io();
socket.on('message', function (data) {
    console.log(data);
});

var randomX = Math.floor(Math.random() * 400) + 1;
var randomY = Math.floor(Math.random() * 400) + 1;

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}
document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 65: // A
            movement.left = true;
            movement.right = false;
            break;
        case 87: // W
            movement.up = true;
            movement.down = false;
            break;
        case 68: // D
            movement.right = true;
            movement.left = false;
            break;
        case 83: // S
            movement.down = true;
            movement.up = false;
            break;
        case 32:
            movement.left = false;
            movement.down = false;
            movement.up = false;
            movement.right = false;
            break;
    }
});
//document.addEventListener('keyup', function(event) {
//  switch (event.keyCode) {
//    case 65: // A
//      movement.left = false;
//      break;
//    case 87: // W
//      movement.up = false;
//      break;
//    case 68: // D
//      movement.right = false;
//      break;
//    case 83: // S
//      movement.down = false;
//      break;
//  }
//});

socket.emit('new player');
setInterval(function () {
    socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
var Fillcolor = '#' + Math.floor(Math.random() * 16777215).toString(16);
//context.font = "30px Arial";
//context.fillText(1,60,50);
socket.on('state', function (players) {
    context.clearRect(0, 0, 800, 600);
    for (var id in players) {
        var player = players[id];
        for (var it in players) {
            var otherPlayer = players[it];
            var col = collisionCheck(player, otherPlayer);
            if (player != otherPlayer && col == true) {
                player.speedX = ((player.speedX + 10) * -1);
                player.speedY = ((player.speedY + 10) * -1);

            }

        }
        context.beginPath();
        context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        context.fillStyle = Fillcolor;
        context.fill();
    }

});

function collisionCheck(player, otherPlayer) {
    var myleft = player.x + 1;
    var myright = player.x + (10 + 1);
    var mytop = player.y + 1;
    var mybottom = player.y + (10 + 1);
    var otherleft = otherPlayer.x + 2;
    var otherright = otherPlayer.x + (10) + 2;
    var othertop = otherPlayer.y + 2;
    var otherbottom = otherPlayer.y + (10) + 2;
    var crash = true;
    if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
        crash = false;
    }
    return crash;

}


///////////////////////////////////////////////////////
var gameHeight = 500;
var gameWidth = 800;
var player1Red
var player2Blue
var wall
var borderL
var borderB
var borderR
var borderT

//The starting positon of the Game
function startGame() {
    myGameArea.start();
    player1Red = new component(30, 30, "red", 20, 120);
    wall = new component(10, 200, "black", 300, 120);
    borderL = new component(10, gameHeight, "black", 0, 0);
    borderB = new component(gameWidth, 10, "black", 0, (gameHeight - 10));
    borderR = new component(10, gameHeight, "black", (gameWidth - 10), 0);
    borderT = new component(gameWidth, 10, "black", 0, 0);
    //            player2Blue = new component(30, 30, "blue", 80, 105);
}

//The "class" or "struct of the player character and any other object
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        //console.log("x: " + this.x + " y: " + this.y);
    }

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBottom();
        this.hitTop();
    }
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
    }
    this.hitTop = function () {
        var rockTop = myGameArea.canvas.height;
        if ((this.y - this.height) > rockTop) {
            this.y = rockTop + this.height;
        }
    }

    this.crashWith = function (otherobj) {
        var myleft = this.x + 1;
        var myright = this.x + (this.width + 1);
        var mytop = this.y + 1;
        var mybottom = this.y + (this.height + 1);
        var otherleft = otherobj.x + 2;
        var otherright = otherobj.x + (otherobj.width) + 2;
        var othertop = otherobj.y + 2;
        var otherbottom = otherobj.y + (otherobj.height) + 2;
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

//Describes the canvas area qualities
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = gameWidth;
        this.canvas.height = gameHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

//Updates the Game screen every frame
function updateGameArea() {
    if (player1Red.crashWith(wall) || player1Red.crashWith(borderL) || player1Red.crashWith(borderB) || player1Red.crashWith(borderR) || player1Red.crashWith(borderT)) {
        richochet();
        myGameArea.clear();
        //player1Red.crashWith(player2Blue) || 
        wall.update();
        borderL.update();
        borderB.update();
        borderR.update();
        borderT.update();
        player1Red.newPos();
        player1Red.update();
        //                player2Blue.update();
        //                myGameArea.stop();
    } else {
        myGameArea.clear();

        borderL.update();
        borderB.update();
        borderR.update();
        borderT.update();
        wall.update();
        player1Red.newPos();
        player1Red.update();
        //                player2Blue.update();
    }
}

function moveup() {
    player1Red.speedY -= 1;
}

function movedown() {
    player1Red.speedY += 1;
}

function moveleft() {
    player1Red.speedX -= 1;
}

function moveright() {
    player1Red.speedX += 1;
}


function richochet() {
    spedX = player1Red.speedX;
    spedY = player1Red.speedY;


    player1Red.speedX *= -1;



}

function stopMove() {
    player1Red.speedX = 0;
    player1Red.speedY = 0;
}


function whichDir() {
    var direction = event.which || event.keyCode;
    console.log(direction);

    switch (direction) {

        case 38:
            moveup();
            break;
        case 40:
            movedown();
            break;
        case 39:
            moveright();
            break;
        case 37:
            moveleft();
            break;
        case 32:
            stopMove();
            break;
    }


}
////////////////////////////////////////////////////////////


var timeleft = 10;
var downloadTimer = setInterval(function(){
  document.getElementById("progressBar").value = 10 - --timeleft;
  if(timeleft <= 0)
    clearInterval(downloadTimer);
},1000);

