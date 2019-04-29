$("ul").on("click", "li", function() {
  $(this).toggleClass("completed");
});

$("ul").on("click", "span", function(evt) {
  $(this).parent().fadeOut(500, function() {
    $(this).remove();
  });
  evt.stopPropagation();
});

$("input[type='text']").on("keypress", function(evt) {
  if (evt.which === 13) {
    var newTodoItem = $(this).val();
    $(this).val("");
    $("ul").append("<li><span><i class='far fa-trash-alt'></i></span> " + newTodoItem + "</li>");
  }
});

$(".fa-plus-square").on("click", function() {
  $("input[type='text']").fadeToggle();
});
