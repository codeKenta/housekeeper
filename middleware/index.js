// ===============================================
// MIDDLEWARES  ==================================
// ===============================================

var middlewareObj = {};

// Check if user is logged in
middlewareObj.isLoggedIn = function (request, response, next){
    if(request.isAuthenticated()){
        return next();
    } else {
      request.flash("error", "Please login first!");
      response.redirect("/");
    }
}

// Check if the user is admin
middlewareObj.isAdmin = function(request, response, next){
  if(request.user.admin === true){
    return next();
  } else {
    response.redirect("/rooms");
  }
}

// Check if the logged in user is the same as the router parameter input
// for accessing the "My Account"-page and features
middlewareObj.checkUserOwnership = function(request, response, next){
  if(request.user._id.equals(request.params.userid)){
    return next();
  } else {
    response.redirect("/rooms");
  }
}

module.exports = middlewareObj;
