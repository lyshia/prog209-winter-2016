// Alyshia JS FOR Project
//get references
var StartScreen = document.getElementById('startScreen');
var StartButton = document.getElementById('startButton');
var PlayScreen = document.getElementById('playScreen');
var EndScreen = document.getElementById('endScreen');
var Ending = document.getElementById('endOutput');
var stage = document.getElementById('stage');
var Output = document.getElementById('output');
var winnerSound = document.getElementById('winner');
var loserSound = document.getElementById('loser');


//make the starting screen show
StartScreen.style.visibility = "visible";
stage.style.visiblilty = "hidden";
PlayScreen.style.visibility = "hidden";
EndScreen.style.visibility = "hidden";

//function to switch the screens
function switchScreen() {
    StartScreen.style.visibility = "hidden";
    PlayScreen.style.visibility = "visible";
    stage.style.visibility = "visible";
    EndScreen.style.visibility = "hidden";
}

//event listeners
StartButton.addEventListener("click", switchScreen, false);
window.addEventListener("keydown", keydownHandler, false);

//The game map
var map = [
    [0, 0, 0, 0, 2, 0, 0, 3],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 1],
    [2, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 1]
];

//The game objects map
var gameObjects = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 5, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [4, 0, 0, 0, 0, 0, 0, 0]
];

//Map code
var WASTELAND = 0;
var OASIS = 1;
var BANDIT = 2;
var HOME = 3;
var CAR = 4;
var MONSTER = 5;

//The size of each cell
var SIZE = 64;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

//Find the car's and monster's start positions
var carRow;
var carColumn;
var monsterRow;
var monsterColumn;

for (var row = 0; row < ROWS; row++) {
    for (var column = 0; column < COLUMNS; column++) {
        if (gameObjects[row][column] === CAR) {
            carRow = row;
            carColumn = column;
        }
        if (gameObjects[row][column] === MONSTER) {
            monsterRow = row;
            monsterColumn = column;
        }
    }
}

//Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//The game variables
var food = 10;
var gold = 10;
var experience = 0;
var gameMessage = "Use the arrow keys to find your way home.";

render();

function keydownHandler(event) {
    switch (event.keyCode) {
        case UP:
            // make sure that the row is not negative
            if (carRow > 0) {
                //Clear the car's current cell
                gameObjects[carRow][carColumn] = 0;

                //make row go up one
                carRow--;

                //update position to  game ovbjects array
                gameObjects[carRow][carColumn] = CAR;
            }
            break;

        case DOWN:
            if (carRow < ROWS - 1) {
                gameObjects[carRow][carColumn] = 0;
                //make row go down
                carRow++;
                gameObjects[carRow][carColumn] = CAR;
            }
            break;

        case LEFT:
            if (carColumn > 0) {
                gameObjects[carRow][carColumn] = 0;
                //column goes left
                carColumn--;
                gameObjects[carRow][carColumn] = CAR;
            }
            break;

        case RIGHT:
            if (carColumn < COLUMNS - 1) {
                gameObjects[carRow][carColumn] = 0;
                //column right
                carColumn++;
                gameObjects[carRow][carColumn] = CAR;
            }
            break;
    }

    //find out what kind of cell the car is on
    switch (map[carRow][carColumn]) {
        case WASTELAND:
            gameMessage = "You drive accross the wasteland"
            break;

        case BANDIT:
            //call function to fight bandits
            fight();
            break;

        case OASIS:
            //call function to go to oasis
            trade();
            break;

        case HOME:
            //function when gets home!
            endGame();
            break;
    }

    //Move the monster
    moveMonster();

    //Find out if the car is touching the monster
    if (gameObjects[carRow][carColumn] === MONSTER) {
        endGame();
    }

    //Subtract some food each turn
    food--;

    //Find out if the car has run out of food or gold
    if (food <= 0 || gold <= 0) {
        endGame();
    }

    //Render the game
    render();
}

function moveMonster() {
    var UP = 1;
    var DOWN = 2;
    var LEFT = 3;
    var RIGHT = 4;

    //An array to store the valid direction that
    //the monster is allowed to move in
    var validDirections = [];

    //The final direction that the monster will move in
    var direction = undefined;

    //Find out what kinds of things are in the cells
    //that surround the monster. If the cells contain WASTELAND,
    //push the corresponding direction into the validDirections array
    if (monsterRow > 0) {
        var thingAbove = map[monsterRow - 1][monsterColumn];
        if (thingAbove === WASTELAND) {
            validDirections.push(UP);
        }
    }
    if (monsterRow < ROWS - 1) {
        var thingBelow = map[monsterRow + 1][monsterColumn];
        if (thingBelow === WASTELAND) {
            validDirections.push(DOWN);
        }
    }
    if (monsterColumn > 0) {
        var thingToTheLeft = map[monsterRow][monsterColumn - 1];
        if (thingToTheLeft === WASTELAND) {
            validDirections.push(LEFT);
        }
    }
    if (monsterColumn < COLUMNS - 1) {
        var thingToTheRight = map[monsterRow][monsterColumn + 1];
        if (thingToTheRight === WASTELAND) {
            validDirections.push(RIGHT);
        }
    }

    //The validDirections array now contains 0 to 4 directions that the
    //contain WASTELAND cells. Which of those directions will the monster
    //choose to move in?

    //If a valid direction was found, Randomly choose one of the
    //possible directions and assign it to the direction variable
    if (validDirections.length !== 0) {
        var randomNumber = Math.floor(Math.random() * validDirections.length);
        direction = validDirections[randomNumber];
    }

    // move monster around the screen
    switch (direction) {
        case UP:
            // just like the car, except for the monster
            gameObjects[monsterRow][monsterColumn] = 0;
            monsterRow--;
            gameObjects[monsterRow][monsterColumn] = MONSTER;
            break;

        case DOWN:
            gameObjects[monsterRow][monsterColumn] = 0;
            monsterRow++;
            gameObjects[monsterRow][monsterColumn] = MONSTER;
            break;

        case LEFT:
            gameObjects[monsterRow][monsterColumn] = 0;
            monsterColumn--;
            gameObjects[monsterRow][monsterColumn] = MONSTER;
            break;

        case RIGHT:
            gameObjects[monsterRow][monsterColumn] = 0;
            monsterColumn++;
            gameObjects[monsterRow][monsterColumn] = MONSTER;
    }
}

function trade() {
    //Figure out how much food the OASIS has
    //and how much it should cost
    var oasisFood = experience + gold;
    var cost = Math.ceil(Math.random() * oasisFood);

    //Let the player buy food if there's enough gold
    //to afford it
    if (gold > cost) {
        food += oasisFood;
        gold -= cost;
        experience += 2;

        gameMessage
            = "You get " + oasisFood + " foods " +
            " for " + cost + " gold."
    } else {
        //Tell the player if they don't have enough gold
        experience += 1;
        gameMessage = "You don't have enough gold for that!"
    }
}

function fight() {

    //The cars strength
    var carStrength = Math.ceil((food + gold) / 2);

    //A random number between 1 and the car's strength
    var banditStrength = Math.ceil(Math.random() * carStrength * 2);

    if (banditStrength > carStrength) {
        //The bandits ransack the car
        var stolenGold = Math.round(banditStrength / 2);
        gold -= stolenGold;

        //Give the player some experience for trying
        experience += 1;

        //Update the game message
        gameMessage
            = "You fight and LOSE " + stolenGold + " gold." +
            " Car's strength: " + carStrength +
            " Bandit's strength: " + banditStrength;
    } else {
        //You win the bandits' gold
        var banditGold = Math.round(banditStrength / 2);
        gold += banditGold;

        //Add some experience
        experience += 2;

        //Update the game message
        gameMessage
            = "You fight and WIN " + banditGold + " gold." +
            " Car's strength: " + carStrength +
            " Bandit's strength: " + banditStrength;
    }
}

function endGameScreen()

{
    EndScreen.style.visibility = "visible";
    StartScreen.style.visibility = "hidden";
    stage.style.visiblilty = "hidden";
    PlayScreen.style.visibility = "hidden";

    //Remove the keyboard listener to end the game
    window.removeEventListener("keydown", keydownHandler, false);
}

function endGame() {
    endGameScreen();

    if (map[carRow][carColumn] === HOME) {
        //Calculate the score
        var score = food + gold + experience;

        //Display the game message
        Ending.innerHTML = "You made it home ALIVE! " + "<br><br> Final Score: <b>" + score +
            "</b><br> Food: <b>" + food + "</b><br> Gold:<b>" + gold;
        winnerSound.currentTime = 0;
        winnerSound.play();
    } else if (gameObjects[carRow][carColumn] === MONSTER) {
        Ending.innerHTML = "Your car has been attacked by Rakks!";
        loserSound.currentTime = 0;
        loserSound.play();
    } else {
        loserSound.currentTime = 0;
        loserSound.play();
        //Display the game message
        if (gold <= 0) {
            Ending.innerHTML += " You've run out of gold!";
        } else {
            Ending.innerHTML += " You've run out of food!";
        }

        Ending.innerHTML += " You die!";
    }
}

function render() {
    // clear cells from prev screens
    if (stage.hasChildNodes()) {
        for (var i = 0; i < ROWS * COLUMNS; i++) {
            stage.removeChild(stage.firstChild);
        }
    }

    //Render the game by looping through the map arrays
    for (var row = 0; row < ROWS; row++) {
        for (var column = 0; column < COLUMNS; column++) {
            //Create a img tag called cell
            var cell = document.createElement("img");

            //Set it's CSS class to "cell"
            cell.setAttribute("class", "cell");

            //Add the img tag to the <div id="stage"> tag
            stage.appendChild(cell);

            //Find the correct image for this map cell
            switch (map[row][column]) {
                case WASTELAND:
                    cell.src = "img/wasteland.png";
                    break;

                case OASIS:
                    cell.src = "img/oasis.png";
                    break;

                case BANDIT:
                    cell.src = "img/bandit.png";
                    break;

                case HOME:
                    cell.src = "img/home.png";
                    break;
            }

            //Add the car and monster from the gameObjects array
            switch (gameObjects[row][column]) {
                case CAR:
                    cell.src = "img/car.png";
                    break;

                case MONSTER:
                    cell.src = "img/monster.png";
                    break;
            }

            //Position the cell
            cell.style.top = row * SIZE + "px";
            cell.style.left = column * SIZE + "px";
        }
    }
    //Display the game message
    output.innerHTML = gameMessage;

    output.innerHTML += "<br>Gold: " + gold + ", Food: " +
        food + ", Experience: " + experience;
}
