
// var colors = [
// 	"rgb(255, 0, 0)",
// 	"rgb(255, 255, 0)",
// 	"rgb(0, 255, 0)",
// 	"rgb(0, 255, 255)",
// 	"rgb(0 0, 255)",
// 	"rgb(255, 0, 255)",
// ]
var colors = [];

var numSquares = 6;
var pickedColor = pickColor();
var clickedColor;

var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById("colorDisplay");
var messageDisplay = document.querySelector("#message");

var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#reset");
var modeButtons = document.querySelectorAll(".mode");


colorDisplay.textContent = pickedColor;
setupModeButtons();
setupSquares();
reset();

resetButton.addEventListener("click", function(){
	reset();
})

function setupModeButtons(){
	for (var i = 0; i < modeButtons.length; i++){
		modeButtons[i].addEventListener("click", function(){

			modeButtons[0].classList.remove("selected");
			modeButtons[1].classList.remove("selected");
			this.classList.add("selected");
			this.textContent === "Easy" ? numSquares = 3: numSquares = 6;
			console.log("ln-43, squares.length:", squares.length);
			reset();
		});
	}
}

function setupSquares() {
	for (var i = 0; i < squares.length; i++) {
		squares[i].style.background = colors[i];

		squares[i].addEventListener("click", function() {
			var clickedColor = this.style.background;
			if (clickedColor === pickedColor) {
				messageDisplay.textContent = "Correct!";
				changeColors(clickedColor);
				h1.style.background = clickedColor;
				resetButton.textContent = "Play Again?"
			} else {
				this.style.backgroundColor = "#232323";
				messageDisplay.textContent = "Try Again";
			}
		});
	}
}

function reset(){
	colors = generateRandomColors(numSquares);
	pickedColor = pickColor();
	colorDisplay.textContent = pickedColor;
	resetButton.textContent = "New Colors"
	messageDisplay.textContent = "";

	for (var i = 0; i < squares.length; i++){
		console.log("squares.length:", squares.length);

		// Hard mode: If there is color to paint, display it.  Bring back the top 3 squares when change from easy to hard mode
		if (colors[i]){
			console.log("if, i: ", i);
			squares[i].style.display = "block";
			squares[i].style.background = colors[i];
		}
		// Easy mode:  colors[] only has the first 3 indices available with colors. So color[3~5] has no val's and goes to "else" here.
		else {
			console.log("else, i: ", i);
			squares[i].style.display = "none";
		}
	}
	h1.style.background = "steelblue";
}

function changeColors(color) {
	for (var i = 0; i < squares.length; i++) {
		squares[i].style.backgroundColor = color;
	}
}

function pickColor() {
	var random = Math.floor(Math.random() * colors.length);
	return colors[random];
}

function generateRandomColors(num){
	var arr = []
	for(var i = 0; i < num; i++){
		arr.push(randomColor())
	}
	return arr;
}

function randomColor(){
	var r = Math.floor(Math.random() * 256);
	var g = Math.floor(Math.random() * 256);
	var b = Math.floor(Math.random() * 256);
	return "rgb(" + r + ", " + g + ", " + b + ")";
}
