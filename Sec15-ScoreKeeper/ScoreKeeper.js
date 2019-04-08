
var p1Display = document.getElementById("p1Display");
var p2Display = document.getElementById("p2Display");
var button1 = document.getElementById("p1");
var button2 = document.getElementById("p2");
var buttonReset = document.getElementById("reset");

// Used to change default playing to score
var defaultPlayingTo = document.querySelector("p > span");
//var UserPlayingTo = document.querySelector("input[type='number']");
var UserPlayingTo = document.getElementsByTagName("input")[0];

var p1Score = 0;
var p2Score = 0;
var gameOver = false;
var winningScore = 5;


UserPlayingTo.addEventListener("change", function() {
	//defaultPlayingTo.textContent = UserPlayingTo.textContent; //WRONG!
	defaultPlayingTo.textContent = UserPlayingTo.value;	//Correct

	winningScore = Number(UserPlayingTo.value);

	reset();
});

button1.addEventListener("click", function() {
	if (!gameOver) {
		p1Score++;
		if (p1Score === winningScore) {			
			p1Display.classList.add("winner");
			gameOver = true;
			console.log("Player One won!");
		}
		p1Display.textContent = p1Score;
	}
});

button2.addEventListener("click", function() {
	if (!gameOver) {
		p2Score++;
		if (p2Score === winningScore) {			
			p2Display.classList.add("winner");
			gameOver = true;
			console.log("Player Two won!");
		}
		p2Display.textContent = p2Score;
	}
});

function reset() {
	gameOver = false;
	p1Score = 0;
	p2Score = 0;
	p1Display.textContent = p1Score;
	p2Display.textContent = p2Score;
	p1Display.classList.remove("winner");
	p2Display.classList.remove("winner");	
}

buttonReset.addEventListener("click", function() {
	reset();
});

