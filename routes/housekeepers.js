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

router.get('/', middleware.isLoggedIn, middleware.isAdmin, function(request, response) {
  User.find({company:request.user.company, admin: false}, function(err, foundHousekeepers){
    if(err){console.log(err); response.redirect("back");
    } else
    response.render('pages/housekeepers/housekeepers', {housekeepers: foundHousekeepers, activeNav: "housekeepers"});
    });
});

// ===========================
// CREATE ROUTE
// Creating new housekeepers
// ===========================

router.post('/', function(request, response) {
  // Create a object filled with the sanitizeed data form the form.

  var cleanPassword = sanitize(request.body.password);

  var newHousekeeper = new User({
    username:   sanitize(request.body.username).toLowerCase(),
    firstname:  sanitize(request.body.firstname),
    lastname:   sanitize(request.body.lastname),
    email:      sanitize(request.body.email).toLowerCase(),
    company:    sanitize(request.user.company),
    admin:      false
  });


if ( (cleanPassword.length > 5 ) && (cleanPassword === request.body.passwordrepeat ) ) {
    User.register(newHousekeeper, cleanPassword, function(err, newHousekeeper){
        if(err){ console.log(err);
          request.flash("error", err.message);
          return response.redirect("back");
        } else {
           response.redirect("/housekeepers");
        }
    });

} else {
  if ( cleanPassword.length < 6 ) {
    request.flash("error", "Please choose a longer password!");
  } else {
    request.flash("error", "Your password does not match the confirm password");
  }
  return response.redirect("back");
}
});

// ================================
// NEW ROUTE
// Shows form for new housekeepers
// ================================

router.get('/new', middleware.isLoggedIn, middleware.isAdmin, function(request, response) {
    response.render('pages/housekeepers/new', {edit: false,  activeNav: "housekeepers"});
});


// ================================
// UPDATE ROUTE
// Showform for edit housekeepers
// ================================

router.get('/:housekeeperid/edit', middleware.isLoggedIn, middleware.isAdmin, function(request, response) {
  var cleanHousekeeprId = sanitize(request.params.housekeeperid);
  User.findById(cleanHousekeeprId, function(err, foundHousekeeper){
    if(err){ console.log(err); return response.redirect("/housekeepers");}
    else {
      response.render('pages/housekeepers/new', {housekeeper: foundHousekeeper, edit: true,  activeNav: "housekeepers"});
    }
  });
});

// ================================
// EDIT ROUTE
// Sends the updated data from
// the edit form to database
// ================================

router.put('/:housekeeperid', middleware.isLoggedIn, middleware.isAdmin, function(request, response) {

  var object = {
    username:   sanitize(request.body.username),
    firstname:  sanitize(request.body.firstname),
    lastname:   sanitize(request.body.lastname),
    email:      sanitize(request.body.email),
  };
  if(request.body.admin === "true"){
    object.admin = true;
  }

  User.findByIdAndUpdate(sanitize(request.params.housekeeperid), object, function(err, pdatedHousekeeper){
   if(err){ console.log(err); return response.redirect("/housekeepers");}
    else {
      response.redirect('/housekeepers');
    }
  });
});

// ================================
// DESTROY ROUTE
// Deletes housekeeper
// ================================

router.delete('/:housekeeperid', middleware.isLoggedIn, middleware.isAdmin, function(request, response) {
  User.findByIdAndRemove(sanitize(request.params.housekeeperid), function(err){
   if(err){ console.log(err); return response.redirect("/housekeepers");}
    else {
      response.redirect('/housekeepers');
    }
  });
});

// Exports routes
module.exports = router;
