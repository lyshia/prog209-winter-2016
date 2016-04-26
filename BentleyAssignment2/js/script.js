// connect to html 
//buttons
var colorSelect = document.getElementById("color");
var clearSelect = document.getElementById("clear");
//color window
var select = document.getElementById("selection");
var errorMess = document.getElementById("error");
var hex = document.getElementById("hexCode");

//functions
function colorChooser(e) {
    //decaled values down here instead of above so I do not have to call them twice, and they change each time i click
    var r = parseInt(document.getElementById("red").value);
    var g = parseInt(document.getElementById("green").value);
    var b = parseInt(document.getElementById("blue").value);

    if (validate(r, g, b)) {
        select.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
        errorMess.style.visibility = "hidden";
        hex.style.visibility = "visible";
        hex.innerHTML = "Hex code: #" + toHex(r, g, b).toUpperCase();

    } else {
        errorMess.style.visibility = "visible";
        hex.style.visibility = "hidden";
        errorMess.innerHTML = "Please select a valid number";
    }

}

// convert to hexadecimal
function toHex(r, g, b) {
    //return each value as a string, since hexadecimal is a string.
    // using a radix of 16, will return the hexadecimal value
    return r.toString(16) +
        g.toString(16) +
        b.toString(16);
}

//validate input
function validate(r, g, b) {
    //if out of range
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || isNaN(r) || isNaN(g) || isNaN(b)) {
        return false;
    } else {
        return true;
    }
}

// reload 
function clearScreen(e) {
    location.reload(true);
}

//click events
//click event for select
colorSelect.addEventListener("click", colorChooser, false);
clearSelect.addEventListener("click", clearScreen, false);
