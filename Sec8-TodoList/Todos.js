//alert("CONNECTED!");

var lis = document.querySelectorAll("li");

for (var i = 0; i < lis.length; i++) {

	lis[i].addEventListener("mouseover", function() {

		// lis[i] is gone when moust is hovered to this specific li.  So use "this" 
		// instead.  "this" here means the event that was triggered on.
		//
		//lis[i].classList.add("selected"); // WRONG!
		//
		this.classList.add("selected");			// CORRECT
	});

	lis[i].addEventListener("mouseout", function() {
		this.classList.remove("selected");
	});

	lis[i].addEventListener("click", function() {
		this.classList.toggle("done");
	});
}