$("#remove-housekeeper-btn").on("click", function(){
  $("#remove-screen-overlay").slideDown();
  console.log("click");
});


$("#remove-housekeeper-no").on("click", function(){
  $("#remove-screen-overlay").slideUp();
});

$("#remove-screen-overlay").on("click", function(){
  $(this).slideUp();
});
