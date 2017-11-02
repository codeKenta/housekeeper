var housekeeperRow = $('.housekeeper-row'),
    goToEditForm   = $("#goto-edit-housekeeper-form-btn");

housekeeperRow.on("click", function(){

  if ($(this).hasClass("selected-housekeeper")) {
    $(this).removeClass("selected-housekeeper");
    goToEditForm.attr("href", "");
    $("#goto-edit-housekeeper-form-btn").hide();
  } else {

    housekeeperRow.removeClass("selected-housekeeper");
    $(this).toggleClass("selected-housekeeper");
    var id = $(this).attr('id');
    var newHref = "/housekeepers/" + id + "/edit"
    goToEditForm.attr("href", newHref);
    $("#goto-edit-housekeeper-form-btn").show();
  }
});
