var express                 = require('express'),
    mongoose                = require('mongoose'),
    ObjectID                = require('mongodb').ObjectID,
    bodyParser              = require("body-parser"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash"),

    // Models
    Company                 = require("./models/company"),
    User                    = require("./models/user");
    Room                    = require("./models/room");

    // Routes
    roomRoutes              = require("./routes/rooms"),
    housekeeperRoutes       = require("./routes/housekeepers"),
    indexRoutes             = require("./routes/index"),
    myaccountRoutes         = require("./routes/myaccount"),

    app         = express();


// ===============================================
// APP CONFIGS ===================================
// ===============================================
app.set('port', (process.env.PORT || 5000)); // Sets the port to the server configs and 5000 as fallback
app.set('views', __dirname + '/views'); // Sets the directory for template files
app.set('view engine', 'ejs'); // Sets the template filetype to .ejs

app.use(express.static(__dirname + '/public')); // Sets the directory for public files like css and scripts
app.use(bodyParser.urlencoded({extended:true})); // Used for sending request data from forms to routes
app.use(methodOverride("_method")); // Used for making other request than POST and GET from form
app.use(flash()); // Flash messeges for displaying success and error messeges to user

// ===============================================
// DATABASE CONFIGS ==============================
// ===============================================

// Sets the URI to the server environment variable that are stored on heroku which connects to the public database
// Adding a fallback string that connects to the developer database which is used for local development
var uri = process.env.MONGODB_URI || "mongodb://housekeeper:sexlaxarienlaxask@ds227045.mlab.com:27045/housekeeper_dev";

mongoose.Promise = global.Promise
mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error !! !! !! =====:'));

// ===============================================
// PASSPORT CONFIGS ==============================
// ===============================================

app.use(require("express-session")({
    secret: "Sex Laxar i en Laxask",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // user.auth.. from passport-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware that applyes to all routes. By using app.use.
// Passing the currentUser and flash-messages variable to the app

app.use(function(request, response, next){
   response.locals.currentUser  = request.user;
   response.locals.error        = request.flash("error");
   response.locals.success      = request.flash("success");
   next();
});

// ===============================================
// ROUTES  =======================================
// ===============================================

app.use("/", indexRoutes);
app.use("/rooms", roomRoutes);
app.use("/housekeepers", housekeeperRoutes);
app.use("/myaccount", myaccountRoutes);

// Redirects if the route not exits
app.get('/*', function(req, res) {
    res.redirect('/rooms');
});

// ++++++++++++++++++++++++++++++++++++++++++++++
// START SERVER +++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++

app.listen(app.get('port'), function() {
  console.log("\n\n+++++++++++++++++++++++++++++++++++++");
  console.log('Node app is running on port', app.get('port'));
  console.log("+++++++++++++++++++++++++++++++++++++\n\n");
});
