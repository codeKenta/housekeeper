// =================================================
// SELECTING AND CHANGING STATUS OF MULTIPLE ROOMS
// ================================================

var changeStatusPanel = $(".change-status"),
    closeChangeStatus = $("#close-change-status"),
    yesBtn            = $("#yes"),
    noBtn             = $("#no"),
    rooms,
    selectedRooms,
    roomsList = [];

// This function is called after the element have been appended to the document so
function initRoomEvent(){
  rooms             = $(".room-row");

  rooms.on("click", function(){

    // If edit form is displayed, there is only possible
    // to select one room at the time
    if(editRoomForm.is(":visible")) {

      if($(this).hasClass("selected-room") ) {
        $(this).removeClass("selected-room");
        selectedRooms = "";
        // Updating the input fields
        $("#edit-roomname").val("");
        editRoomForm.slideUp();
      } else {
        // removes all other selected rooms. So only one can be selected
        $(".selectet-rooms").removeClass("selected-room");

        // clears the selectedRoom
        selectedRooms = "";

        //toggles the class for selected room for the element
        $(this).toggleClass("selected-room");

        // updating the selecedRooms variable
        selectedRooms = $(".selected-room");

        // Updating the input fields
        editRoomInputs();
      }

    } else {
      $(this).toggleClass("selected-room");
      showChangeStatusPanel();
    }

    // stores the selected rooms in variable
    selectedRooms = $(".selected-room");

    // If the rooms are deselected, the panel is hidden
    if ( selectedRooms.length === 0 ) {
      hideChangeStatusPanel(true);
      toggleEditRoomButton.hide();
      editRoomForm.slideUp();

    } else if (selectedRooms.length === 1){
      toggleEditRoomButton.show();

    } else if (selectedRooms.length > 1) {
      toggleEditRoomButton.hide();
      editRoomForm.slideUp();
    }
  });
}


// ===================================
// Close button for closing the panel
// ==================================
closeChangeStatus.on("click", function(){
  hideChangeStatusPanel(true);
});

// ======================
// Change Status Buttons
// ======================

yesBtn.on("click", function(){
  selectedRooms.each(function() {
    roomsList.push(this.id);
  });
  var inputData = {};
  inputData.roomid       = roomsList;
  inputData.cleaned      = true;
  inputData.changeStatus = true;

  ajaxCall(inputData, "PUT", "/rooms/changestatus");

  $(".selectet-rooms").removeClass("selected-room");
  roomsList = [];
  hideChangeStatusPanel(true);
  getRooms();
});

noBtn.on("click", function(){
  selectedRooms.each(function() {
    roomsList.push(this.id);
  });

  var inputData = {};
  inputData.roomid       = roomsList;
  inputData.cleaned      = false;
  inputData.changeStatus = true;

  ajaxCall(inputData, "PUT", "/rooms/changestatus");
  $(".selectet-rooms").removeClass("selected-room");
  roomsList = [];
  hideChangeStatusPanel(true);
  getRooms();
});


// =====================================
// Functions to be called for hide/Show
// The Change Status Panel
// =====================================
// Parameter is set to true if all rooms will be deselected
// Hide
function hideChangeStatusPanel(deselectRooms){
  changeStatusPanel.hide('slide', {direction: 'down'});
  $(".content-container").css("paddingBottom", "0");
  if( deselectRooms === true){
      $(".selectet-rooms").removeClass("selected-room");
  }
}

// SHOW
function showChangeStatusPanel(){
  changeStatusPanel.show('slide', {direction: 'down'});
  // Adding extra padding to container element so the
  // bottom rooms in list can be reached
  $(".content-container").css("paddingBottom", "200px");
}

// ================================================
// CLEAR SELECTED ROOMS &
// HIDEDITROOMELEMENTS
// ================================================
// Functions for deselecting all selected rooms.
// Function for hiding all elements that is needed for editing a room

function clearSelectedRooms(){
  // removes all selected rooms. So only one can be selected
  $(".selectet-rooms").removeClass("selected-room");
  // clears the selectedRoom
  selectedRooms = "";
}

function hideEditRoomElements() {
  clearSelectedRooms();
  toggleEditRoomButton.hide();
  editRoomInput.val("");
  editRoomForm.slideUp();
}

// ================================================
// ADDING ROOM  ===================================
// ================================================
var addRoomForm             = $("#add-room-form"),
    toggleAddRoomButton     = $("#toggle-add-room-form-btn"),
    addRoomButton           = $("#add-room-btn");

toggleAddRoomButton.on("click", function(){
  // Make sure that edit form is hidden
  hideChangeStatusPanel(true);
  editRoomForm.slideUp();
  addRoomForm.slideToggle();
});

addRoomButton.on("click", function(event){
  event.preventDefault();
  var inputData = {};
  inputData.roomname = $("#roomname").val();
  ajaxCall(inputData, "POST", "/rooms");
  addRoomForm.slideUp();
  getRooms();
});

// ================================================
// EDIT ROOM  ===================================
// ================================================
var editRoomForm             = $("#edit-room-form"),
    toggleEditRoomButton     = $("#toggle-edit-room-form-btn"),
    editRoomButton           = $("#edit-room-btn"),
    editRoomInput            = $("#edit-roomname");

toggleEditRoomButton.on("click", function(){

  // Make sure that add-room-form is hidden
  addRoomForm.slideUp();

  // Toggles visibility of change status form so its only visible if the editmode is not activated
  if (changeStatusPanel.is(":visible")){
    hideChangeStatusPanel(false);
  } else {
    showChangeStatusPanel();
  }

  if(selectedRooms.length === 1){

    // Insert ther current roomname into the field
    editRoomInputs();
    console.log("field", editRoomInput.val());
  } else {
    editRoomInput.val("");
  }
  editRoomForm.slideToggle();
});


// Function for updating the input fields for edit room
function editRoomInputs(){
  editRoomInput.val(selectedRooms.find(".td-roomname").text());
}


///////////////////////
// Edit Room Button
editRoomButton.on("click", function(event){
  event.preventDefault();
  var inputData = {};
  inputData.roomId = selectedRooms[0].id;
  inputData.roomname = editRoomInput.val();

  ajaxCall(inputData, "PUT", "/rooms/" + inputData.roomId);
  editRoomInput.val("");
  editRoomForm.slideUp();
  hideChangeStatusPanel(true);
  getRooms();
});

///////////////////////
// Delete Room Button
var removeRoomButton = $("#remove-room-btn");

  removeRoomButton.on("click", function(event){
  event.preventDefault();
  inputData = {};
  inputData.roomId = selectedRooms[0].id;
  ajaxCall(inputData, "DELETE", "/rooms/" + inputData.roomId);
  hideEditRoomElements();
  hideChangeStatusPanel(true);
  getRooms();
});


// ================================================
// APPEND ROOMS ===================================
// ================================================
// Function for writing rooms to document
function appendRooms(){
    $("#rooms-tbody").empty();

    for (var i = 0; i < rooms.length; i++) {

      var roomStatus;

      if (rooms[i].cleaned === true) {
      roomStatus = "<td class='yes'>Yes</td>"
     } else if(rooms[i].cleaned === false){
       roomStatus = "<td class='no'>No</td>"

     }

      var string   = "<tr class='room-row table-row' id=" + rooms[i]._id + ">" +
                     "<td class='td-roomname'>" +  rooms[i].name + "</td>" +
                     roomStatus +
                     "<td class='hide-small'>" + rooms[i].cleanedBy + "</td>" +
                     "<td class='hide-small'>" + rooms[i].cleaned_date + "</td>" +
                     "</tr>";
      $("#rooms-tbody").append(string);
    }
    initRoomEvent();
}


// ================================================
// GET SEARCH RESULTS  ============================
// ================================================
// Refreshing and filtering results
// the sessionStorage-filtervariable have to be one of follwing:
// "all" - Show all the rooms
// "cleaned" - Show onlye cleaned rooms
// "notCleaned" – show rooms that needs to be cleaned


// Refresh button
$("#refresh-btn").on("click", function(){
  hideEditRoomElements();

  hideChangeStatusPanel(true);
  getRooms();
});


$("#all").on("click", function(){
  hideEditRoomElements();

  sessionStorage.filter = "all";
  hideChangeStatusPanel(true);
  getRooms();
});

$("#cleaned").on("click", function(){
  hideEditRoomElements();

  sessionStorage.filter = "cleaned";
  hideChangeStatusPanel(true);
  getRooms();
});

$("#notCleaned").on("click", function(){
  hideEditRoomElements();
  sessionStorage.filter = "notCleaned";
  getRooms();
});


function setFilter(){

  if ( sessionStorage.filter === "all" ){
    $("#all").prop("checked", true);
  } else if( sessionStorage.filter === "cleaned" ) {
    $("#cleaned").prop("checked", true);
  } else if ( sessionStorage.filter === "notCleaned" ) {
      $("#notCleaned").prop("checked", true);
  }
}

// ================================================
// AJAX FUNCTIONS =================================
// ================================================

function ajaxCall(inputData, method, url){
  $.ajaxSetup({
    url: url,
    global: false,
    cache: false,
    asyc: true,
    type: method,
    data: inputData,

    success: function(data){
      console.log(data);
    },
    error: function(data){
      console.log('error!', data);
    }
  });
  $.ajax();
};

function getRooms(){
  rooms = $.parseJSON($.ajax({
        url:  'rooms/roomlist/' + sessionStorage.filter,
        async: false,
        type: "GET",
    }).responseText);
  appendRooms();
}

// ================================================
// DOCUMENT READY =================================
// ================================================

$( document ).ready(function() {
  if (!sessionStorage.filter){
    sessionStorage.filter = "all";
  }
  setFilter();
  getRooms();
  setInterval(function(){
    selectedRooms = $(".selected-room");
    // If no rooms are selected, update list
    if ( selectedRooms.length === 0 ) {
      getRooms();
    }
  }, 1000 * 60);
});
