// Step1: div's stays after fadeOut()
$("button").on("click", function() {
	$("div").fadeOut(1000);
	console.log("Fade Completed");
});

// Step2: div's removed after fadeOut()
$("button").on("click", function() {
	$("div").fadeOut(1000, function() {
		$(this).remove();
	});
});

// Step3:
$("button").on("click", function() {
	$("div").fadeIn(1000, function() {
	});
});

// Step4: Click the button again to fadeIn() the 3 div's
$("button").on("click", function() {
	$("div").fadeToggle(500);
});
