var express   = require("express");
    router    = express.Router(),
    sanitize  = require('mongo-sanitize'),
    passport  = require("passport"),
    Company   = require("../models/company"),
    User      = require("../models/user");


// ===============================================
// ROUTES INDEXPAGE ==============================
// ===============================================

// Showing landingpage of app
router.get('/', function(request, response) {
  response.render('pages/index');
});

// ===============================================
// LOGIN ROUTES ==================================
// ===============================================

router.post("/login",
    // Middelware
    passport.authenticate("local", {
      successRedirect:  "/rooms",
      failureRedirect:  "/",
      failureFlash:     true
    }),
    // Callback
    function (request, response){
});

// ===============================================
// LOGOUT ROUTES =================================
// ===============================================

router.get("/logout", function(request, response){
    request.logout();
    response.redirect("/");
});

// ===============================================
// SIGN UP  ======================================
// ===============================================
router.get("/signup", function(request, response){
    response.render('pages/rooms');
});

// Handle sing up logic
router.post("/signup", function(request, response){

  var cleanPassword = sanitize(request.body.password);

  // Preventing short password and password that not matches
  // the repeat password to be added to database
  if ( (cleanPassword.length > 5 ) && (cleanPassword === request.body.passwordrepeat ) ) {

    // Create a object filled with data form the signup form
    var newUser = new User({
        username:   sanitize(request.body.username),
        firstname:  sanitize(request.body.firstname),
        lastname:   sanitize(request.body.lastname),
        email:      sanitize(request.body.email),
        company:    "",
        admin:      true
    });

    // Stores the company name from the signupform in a variable
    var companyName = sanitize(request.body.company);

    // Decare empty variable, used later to store the company id
    var companyId;

    // Seraching the db for any results that matches the companyname.
    Company.findOne({name: companyName}, function (err, foundCompany) {
      if(err) { console.log(err); return response.redirect("/");} // Error hadler

      else {
         if (!foundCompany) {
           // If the company not exists in db
           // Then add the company to db

            Company.create({name: companyName}, function(err, newCompany){
               if(err) { console.log(err); return response.redirect("/");} // Error hadler

               else {
                 // Stores the companydID of the created document in a variable
                 company_id = newCompany._id;
                 // Adds the company id to the newUser object
                 newUser.company = (company_id);
               }
               });
         } else {
           // If there was a result

            // Stores the companydID of the created document in a variable
           company_id = foundCompany._id;
           // Adds the company id to the newUser object
           newUser.company = company_id;
         }

         // Register the user with passport
         User.register(newUser, cleanPassword, function(err, newUser){
             if(err){
               console.log(err);
               request.flash("error", err.message);
               return response.redirect("/");
             } else {
                passport.authenticate("local")(request, response, function(){
                response.redirect("/rooms");
               });
             }
         });
      }
    });
  } // end if password matches
  else {
    if ( cleanPassword.length < 6 ) {
      request.flash("error", "Please choose a longer password!");
    } else {
      request.flash("error", "Your password does not match the confirm password");
    }
    return response.redirect("/");
  }
});

// Exports routes
module.exports = router;
