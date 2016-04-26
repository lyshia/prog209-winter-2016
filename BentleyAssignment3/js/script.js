// JavaScript source code
//The input and output fields
var input = document.querySelector("#input");
var output = document.querySelector("#output");
var restartButton = document.querySelector("#restart");
var wrap = document.querySelector("#wrapper");

//tried putting images in the object literal, but it was messy
var img = document.getElementById("image");

var defImg = new Image();
defImg.src = "img/default.jpg";

var win = new Image();
win.src = "img/win.jpg";

var lose = new Image();
lose.src = "img/lose.png";

//Game variables
var mysteryNumber = Math.floor(Math.random() * 50)+1;
//var playersGuess = 0;
console.log(mysteryNumber);


// numberGame object
var numberGame =
{
    maxNum: 50,
    minNum: 0,
    playersGuess : 0,
    guessesRemaining : 5,
    guessesMade : 0,
    gameWon: false,

};

var gameState = "";

//The button
var button = document.querySelector("button");
button.addEventListener("click", clickHandler, false);
button.style.cursor = "pointer";

//Listen for enter key presses
window.addEventListener("keydown", keydownHandler, false);

//be able to play again after reset
input.disabled = false;
button.disabled = false;
restartButton.style.visibility = "hidden";


function keydownHandler(event)
{
    if(event.keyCode === 13)
    {
        validateInput();
    }
}

function clickHandler()
{
    validateInput();
}
// make sure user inputs correct number
function validateInput()
{
    playersGuess = parseInt(input.value);

    //If you're worried about infinity, use this:
    //!isNaN(playersGuess) && isFinite(playersGuess);
    if(isNaN(playersGuess) || playersGuess < numberGame.minNum || playersGuess > numberGame.maxNum )
    {
        output.innerHTML = "Please enter a valid number.";
    }
    else
    {
        playGame();
    }
}
// Play the Game
function playGame()
{
    numberGame.guessesRemaining -=1;

    numberGame.guessesMade += 1;

    gameState
      = " Guess: " + numberGame.guessesMade
      + ", Remaining: " + numberGame.guessesRemaining;

    playersGuess = parseInt(input.value);

    if(playersGuess > mysteryNumber)
    {
        output.innerHTML = "That's too high." + gameState;

        //Check for the end of the game
        if (numberGame.guessesRemaining < 1)
        {
            endGame();
        }
    }
    else if(playersGuess < mysteryNumber)
    {
        output.innerHTML = "That's too low." + gameState;

        //Check for the end of the game
        if (numberGame.guessesRemaining < 1)
        {
            endGame();
        }
    }
    else if(playersGuess === mysteryNumber)
    {
        numberGame.gameWon = true;
        endGame();
    }
}
// Reset the game
function restartGame()
{
    location.reload();
}

//End of Game
function endGame()
{


    if (numberGame.gameWon)
    {
        var winColor = "#C7AF43";
        wrap.style.backgroundColor = winColor;
        img.src = win.src;
        output.innerHTML
          = "You win! The number was " + mysteryNumber + "!" + "<br>"
          + "It only took you " + numberGame.guessesMade + " guesses.";
    }
    else
    {
        wrap.style.backgroundColor = "white";
        img.src = lose.src;
        output.innerHTML
          = "You Lose!" + "<br>"
          + "The number was: " + mysteryNumber + ".";
    }

    restartButton.style.visibility = "visible";
    restartButton.addEventListener("click", restartGame, false);

    //Disable the button
    button.removeEventListener("click", clickHandler, false);
    button.disabled = true;

    //Disable the enter key
    window.removeEventListener("keydown", keydownHandler, false);

    //Disable the input field
    input.disabled = true;
}
