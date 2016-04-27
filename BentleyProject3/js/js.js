// Alyshia Bentley JS built on Animal Farm project
var startScreen = document.getElementById('StartScreen');
var gameScreen = document.getElementById('GameScreen');
var endScreen = document.getElementById('EndScreen');

var btn = document.getElementById('startButton');
var rbtn = document.getElementById('resetButton');

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var displayScore = document.getElementById('score');
var displayTimeLeft = document.getElementById('timeLeft');
var Output = document.getElementById('output');

//default visibility
startScreen.style.visibility = "visible";
gameScreen.style.visibility = "hidden";
endScreen.style.visibility = "hidden";

// switch from start screen to ggame screen
switchScreen = function() {

    startScreen.style.visibility = "hidden";
    gameScreen.style.visibility = "visible";
    endScreen.style.visibility = "hidden";

}

// reload the page
reset = function() {
    location.reload();
}

var score = 0;
// make timer object

var objTimer = {
    time: 0,
    interval: undefined,

    start: function() {
        var self = this;
        this.interval = setInterval(function() {
            self.tick();
        }, 1000);
    },
    tick: function() {
        this.time--;
    },
    stop: function() {
        clearInterval(this.interval);
    },
    reset: function() {
        this.time = 0;
    }
};

// create sprite object
var sprite = {
    //default position
    source: 0,
    //size of sprite
    SIZE: 64,
    //location of sprite
    SHOWLOC: 0,
    // location of explosion
    HITLOC: 192,

    // make the sprites appear at random locations
    x: Math.floor(Math.random() * 636) + 1,
    y: Math.floor(Math.random() * 436) + 1,

    // sprite states
    HIDING: 256,
    MOVING: 1,
    HIT: 2,
    state: 256,

    //give default points
    points: 3,

    //velocity in x and y directions
    vx: 2,
    vy: 2,

    // use to reset the sprite
    timeToReset: 8,
    resetCounter: 0,

    waitTime: undefined, // stores the random time to wait before displaying

    /*  setInvisible: function()
    	{
    		myFunc = function()
    		{
    			this.state = this.HIDING;
    		}
    		var invisible = setTimeout(myFunc, 1000);


    	},
    */
    // Method to find random animation time
    setWaitTime: function() {
        this.waitTime = Math.floor(Math.random() * 10) * 30;
    },
    updateAnimation: function() {

        // Change the behavior of animation based on the state
        if (this.state === this.HIT) {

            this.resetCounter++;

            //Reset the animation if the resetCounter equals the timeToReset
            if (this.resetCounter === this.timeToReset) {
                // change to the explosion
                this.source = this.HITLOC;
                //make hide
                //this.setInvisible();
                this.state = setInterval(function() {
                    this.state = this.HIDING;
                }, 5000);

                this.currentFrame = 0;
                this.resetCounter = 0;
                // add the correct amout of points
                score += this.points;
                this.setWaitTime();
            }

        } else if (this.waitTime > 0 || this.waitTime === undefined) {
            // sprite is hiding
            this.source = 256;
            this.waitTime--;
        } else {
            // sprite is visible
            this.source = this.SHOWLOC;

            // check if sprite has moved out of bounds in x direction
            if (this.x > canvas.width - this.SIZE || this.x < 0) {
                this.vx = -this.vx;
            }

            this.x += this.vx;

            //check to see if sprite has moved out of bounds in y direction
            if (this.y > canvas.height - this.SIZE || this.y < 0) {
                this.vy = -this.vy;
            }
            this.y += this.vy;

        }
    }
};

var gameTimer = Object.create(objTimer);

// array to store the sprites
var sprites = [];

var threeEyes = Object.create(sprite);
//put in array
sprites.push(threeEyes);

//create the alien, and give it sepcific attributes
var alien = Object.create(sprite);
alien.source = 64;
alien.SHOWLOC = 64;
alien.vx = 3;
alien.vy = 4;
alien.points = 2;
alien.x = Math.floor(Math.random() * 336) + 1;
alien.y = Math.floor(Math.random() * 436) + 1;
//add to the array of sprites
sprites.push(alien);

//creeate the space ship,and give its own settings
var ship = Object.create(sprite);
ship.source = 128;
ship.SHOWLOC = 128;
ship.vx = 4;
ship.vy = 5;
ship.points = 4;
ship.x = Math.floor(Math.random() * 336) + 1;
ship.y = Math.floor(Math.random() * 436) + 1;
// add to the array of sprites
sprites.push(ship);

// Load image
//
var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "images/spritesheet.png";

// Listen for mouse down events
//
canvas.addEventListener("mousedown", mouseDownHandler, false);

function loadHandler() {

    for (var i = 0; i < sprites.length; i++) {
        sprites[i].setWaitTime();
    }

    //	alert("Time to wait: " + sprite.waitTime/60 + " seconds");

    // Start the game timer
    gameTimer.time = 30;
    gameTimer.start();

    // Start the animation loop (runs indefinitely)
    animationLoop();
}

function mouseDownHandler(event) {

    // Calculate mouse (x,y) relative to canvas origin
    // Note: the event.pageX and event.pageY mouse coordinates are relative
    //       to the top-left corner of the screen, so need to use the canvas
    //       offsetLeft and offsetTop properties to get canvas (0,0)
    var canvas_x = event.pageX - canvas.offsetLeft;
    var canvas_y = event.pageY - canvas.offsetTop;

    for (var i = 0; i < sprites.length; i++) {
        // Check if mouse was clicked on the sprite
        if (canvas_x > sprites[i].x && canvas_x < sprites[i].x + sprites[i].SIZE &&
            canvas_y > sprites[i].y && canvas_y < sprites[i].y + sprites[i].SIZE) {
            // Yes! Stop the animation
            sprites[i].state = sprites[i].HIT;

        }
    }

}

//**************************************************************************
// Game animation loop: fires every frame (60 times/sec)
//
function animationLoop() {

    // As long as game timer is positive, run the game animation loop
    if (gameTimer.time > 0) {
        // Animation loop runs about 60 frames/sec
        requestAnimationFrame(animationLoop, canvas);
    }

    //loop through array to update everyones animation
    for (var i = 0; i < sprites.length; i++) {
        sprites[i].updateAnimation();
    }

    // Check for end of game
    if (gameTimer.time === 0) {
        endGame();
    }

    // Display the game
    render();
}
//
//**************************************************************************

function endGame() {
    gameTimer.stop();
    startScreen.style.visibility = "hidden";
    //gameScreen.style.visibility = "hidden";
    endScreen.style.visibility = "visible";

    Output.innerHTML = "<br>Your score:<b> " + score + " </b><br>";
    if (score < 30) {
        Output.innerHTML += "You didn't really splat too many aliens now. SHAME!";
    } else if (score < 50) {
        Output.innerHTML += "You did an ok job. ";
    } else {
        Output.innerHTML += " Remind me not to get on your bad side!";
    }
}

// Draw game
function render() {

    // Clear context
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw game state for each item in array of sprites
    for (var i = 0; i < sprites.length; i++) {
        ctx.drawImage(image,
            sprites[i].source, 0, 64, 64,
            Math.floor(sprites[i].x), Math.floor(sprites[i].y), 64, 64);
    }

    // Display game stats
    displayScore.innerHTML = "Aliens Hit: " + score;
    displayTimeLeft.innerHTML = "Time Left: " + gameTimer.time;
}

btn.addEventListener("click", switchScreen, false);
rbtn.addEventListener("click", reset, false);
