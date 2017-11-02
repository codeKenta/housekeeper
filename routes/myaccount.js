var express     = require("express");
    router      = express.Router(),
    sanitize    = require('mongo-sanitize'),
    Company     = require("../models/company"),
    User        = require("../models/user"),
    middleware  = require("../middleware");

// ===========================
// SHOW ROUTE
// Showing list of housekeepers
// ===========================

router.get('/:userid/edit', middleware.isLoggedIn, middleware.checkUserOwnership, function(request, response) {
  User.findById(sanitize(request.params.userid), function(err, foundUser){
    if(err){ console.log(err); return response.redirect("/housekeepers");}
    else {
      response.render('pages/myaccount', {user: foundUser, activeNav: "myaccount"});
    }
  });
});

// ================================
// EDIT ROUTE
// Sends the updated data from
// the edit form to database
// ================================

router.put('/:userid', middleware.isLoggedIn, middleware.checkUserOwnership, function(request, response) {

  var object = {
    username:   sanitize(request.body.username),
    firstname:  sanitize(request.body.firstname),
    lastname:   sanitize(request.body.lastname),
    email:      sanitize(request.body.email),
  };

  cleanUserId = sanitize(request.params.userid);

  User.findByIdAndUpdate(cleanUserId, object, function(err, updatedUser){
   if(err){
     console.log(err);
     request.flash("error", "Sorry, something went wrong. Please try again.");
     response.redirect("/myaccount/" + cleanUserId + "/edit");
   } else {
      request.flash("success", "Your account have been uppdated.");
      response.redirect("/myaccount/" + cleanUserId + "/edit");
    }
  });
});

// ================================
// DESTROY ROUTE
// Deletes housekeeper
// ================================

router.delete('/:userid', middleware.isLoggedIn, middleware.checkUserOwnership, function(request, response) {
  cleanUserId = sanitize(request.params.userid);
  User.findByIdAndRemove(cleanUserId, function(err){
    if (err) {
      console.log(err);
      request.flash("error", "Sorry, something went wrong. Please try again.");
      response.redirect("/myaccount/" + cleanUserId + "/edit");
    } else {
      request.flash("success", "Your account have been removed.");
      response.redirect('/');
    }
  });
});


// Exports routes
module.exports = router;
