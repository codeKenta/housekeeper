var express     = require("express"),
    router      = express.Router(),
    sanitize    = require('mongo-sanitize'),
    Room        = require("../models/room"),
    functions   = require("../functions"),
    middleware  = require("../middleware");


// ===========================
// SHOW ROUTE
// Showing list of rooms
// ===========================
router.get('/', middleware.isLoggedIn, function(request, response) {
    response.render('pages/rooms', {activeNav: "rooms"});
});

// ===========================
// SHOW-LIST ROUTE
// Show List of rooms,
// called by ajax
// ===========================

router.get('/roomlist/:filter', middleware.isLoggedIn, function(request, response) {

  var filter = sanitize(request.params.filter);
  var query = { company: sanitize(request.user.company) };

  if (filter === "cleaned"){
    query.cleaned = true
  } else if (filter === "notCleaned"){
    query.cleaned = false;
  }

  Room.find(query, function(err, foundRooms){
    if(err){
      console.log(err); response.redirect("/rooms");
    } else
    response.json(foundRooms);
    });
});


// ===========================
// CREATE ROUTE
// Creating new room
// ===========================

router.post('/', middleware.isLoggedIn, function(request, response){

  // Creates a new object for the new room
  var newRoom =
    {
      name:    sanitize(request.body.roomname),
      cleaned: true,
      company: sanitize(request.user.company),
      cleanedBy: "",
      cleaned_date: functions.dateFormat(new Date())
    }

  // Find the logged in users company
  Room.create(newRoom, function(err, createdRoom){

      if(err){
        console.log(err); response.redirect("/rooms");
      } else {

        response.redirect("/rooms");
      }
  });
});


// ====================================
// CHANGE STATUS ROUTE
// Changes the cleaned status for room
// ====================================
router.put('/changestatus', middleware.isLoggedIn, function(request, response){

  var query = {};
  var updateObject = {
    cleaned:      sanitize(request.body.cleaned),
  };

  // If the rooms is cleaned (bodyparser returns strings, not boolean)
  if (request.body.cleaned === "true") {
    updateObject.cleaned_date = functions.dateFormat(new Date());
    // Only sets the name if the change has been set by a housekeeper
    if (request.user.admin === false) {
      updateObject.cleanedBy = request.user.username;
    }
  }

  // Restores the cleanedby-field if the change has been made by admin
  if (request.user.admin === true) {
    updateObject.cleanedBy = "";
  }

  request.body.roomid.forEach(function(roomId){
    Room.update({"_id": sanitize(roomId)}, {"$set": sanitize(updateObject)}, function(err, updatedRoom){
      if (err) {
        console.log(err);
      }
    });
  });
  response.status(200).json({
      status: 'success',
      message: `Changed Status`
    });
});

// ================================
// EDIT ROUTE
// Sends the updated data from
// the edit form to database
// ================================

router.put('/:roomid', middleware.isLoggedIn, middleware.isAdmin, function(request, response){
  Room.findByIdAndUpdate(sanitize(request.params.roomid), {name: sanitize(request.body.roomname)}, function(err, updatedRoom){
    if (err) {
      console.log(err);
      response.status(500).json({
          status: 'Error',
          message: `Database Error`
        });
    } else {
      response.status(200).json({
          status: 'success',
          message: `Updated Room`
        });
    }
  });
});

// ====================
// DESTROY ROUTE
// Deletes room
// ====================

router.delete('/:roomid', middleware.isLoggedIn, middleware.isAdmin, function(request, response){
  Room.findByIdAndRemove(sanitize(request.params.roomid), function(err){
    if (err) {
      console.log(err);
      response.status(500).json({
          status: 'Error',
          message: `Database Error`
        });
    } else {
      console.log("deleted")
      response.status(200).json({
          status: 'success',
          message: `Deleted Room`
        });
    }
  });
});

// Exports routes
module.exports = router;
