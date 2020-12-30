//get DPI DOTS PER INCH / PPI PIXELS PER INCH
let dpi = window.devicePixelRatio;


// Grab reference of canvas & set up context to be able to draw

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


// frames per second var holds custom speed num for request animation frame method

let framesPerSecond = 60;

// X & Y position on canvas

var x = canvas.width*2;
var y = canvas.height+500;

// add value to x & y after every frame

var dx = 2;
var dy = -2;

// ballRadius that will hold the radius of the drawn circle and be used for calculations//

var ballRadius = 40;

// defining the height and width of the paddle and its starting point on the x axis

var paddleHeight = 30;
var paddleWidth = 245;
var paddleX = (canvas.width-paddleWidth)/2;

// vars holding info on button pressed

var rightPressed = false;
var leftPressed = false;

// information about the bricks such as their width and height, rows and columns, so bricks can be drawn

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 400;
var brickHeight = 60;
var brickPadding = 15;
var brickOffsetTop = 75;
var brickOffsetLeft = 65;

// variable to record the score

var score = 0;

// variable holding num of lives

var lives = 3;


var requestAnimationFrame = window.requestAnimationFrame ||
							window.mozRequestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.msRequestAnimationFrame;

// two dimensional array holding all bricks, brick columns (c), which in turn will contain the brick rows (r), which in turn will each contain an object containing the x and y position to paint each brick on the screen - adding key/value pair of status

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };

    }
}


// event listeners for up and down keys for controlls

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// event listener for mouse movement

document.addEventListener("mousemove", mouseMoveHandler, false);




function fix_dpi() {
//get CSS height getComputedStyle method (canvas) chained to getPropertyValue of "height" of "canvas" chained to slice method to return string minus "px"
//the + prefix casts it to an integer whole number

  // CURRENT HEIGHT
let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);


// CURRENT WIDTH
let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

//scale the canvas
  // Change height based on current (window / viewport) height X dpi
canvas.setAttribute('height', style_height * dpi);
canvas.setAttribute('width', style_width * dpi);

}





// When we press a key down, this information is stored in a variable. The relevant variable in each case is set to true. When the key is released, the variable is set back to false.

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// update paddle position based on pointer coordinates, using clientX (mousemove API) - offSetLeft (HTML DOM API), relativX - 1/2 paddleWidth, anchors pointer to paddle center.


function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}




// collision detection function that will loop through all the bricks and compare every single brick's position with the ball's coordinates as each frame is drawn. define the b variable for storing the brick object in every loop of the collision detection, if collision balls moves away - status of brick changed to 0, so draw function will not draw again in new frame, score increases, when score == # of bricks - win.

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                      score++;
                      if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// draws text for score keeping

function drawScore() {
    ctx.font = "bold 50px Helvetica, Arial, sans-serif";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 65, 50);
}

// draws lives left

function drawLives() {
    ctx.font = "bold 50px Helvetica, Arial, sans-serif";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, 1925, 50);
}

// define a drawing loop (draw function called by setInterval 10 mil sec)

// drawBall draws the ball

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};

// drawPaddle draws the paddle

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// drawBricks draws bricks from top left, brickX & brickY calc for correct position of each new brick. using two dimensional array with status key/value pair. Only draw if status = 1.

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// draw function draws everything while moving (animating) using request animation frame & set time out method with anonuymous func holding "draw" statements & frames per second variable holding custom speed num to control speed of animation

function draw() {
	setTimeout(function() {
		// fix blurry canvas
	 fix_dpi()

   // removes earlier drawn image so no trail visible
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
    // calls drawBricks func
    drawBricks();
    // calls drawBall function
    drawBall();
    // calls drawPaddle function
    drawPaddle();
    // calls drawScore function
    drawScore();
    // calls drawLives function
    drawLives();
    // calls collisionDectection function
    collisionDetection();


// COLLISION DETECTION left & right wall- if x axis postion plus x axis increment is greater than canvas width minus ballRadius OR if x axis plus x axis increment is less than ballRadius subtract increment amount (move back)

// 2nd If statement collision with top wall move away, if touch bottom game over and reload, if touch paddle move back

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if(y + dy < ballRadius) {
    dy = -dy;
  } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
          lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
							x = canvas.width/2;
		 					y = canvas.height-30;
		 					dx = 3;
		 					dy = -3;
		 					paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

// if rightPressed true add 7 to paddle x axis position moving right vice versa for leftPressed

// KEEP PADDLE INSIDE CANVAS, if paddle position plus paddle width is greater than canvas width (boundary) change position to canvas width minus paddle width.
// If paddle position is less than 0 (left boundary) move to 0 - left boundary

if(rightPressed && paddleX < canvas.width-paddleWidth) {
paddleX += 7;
}
else if(leftPressed && paddleX > 0) {
paddleX -= 7;
}

// apply increment to axis positions

    x += dx;
    y += dy;

// giving control of the framerate back to the browser It will sync the framerate accordingly and render the shapes only when needed. This produces a more efficient, smoother animation loop than the older setInterval  method.

requestAnimationFrame(draw);

}, 1000 / framesPerSecond);


};

// draw();
requestAnimationFrame(draw);
