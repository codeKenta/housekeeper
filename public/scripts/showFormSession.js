/*

Following scripts are used for displaying login form or sign up form.
sessionStorage is used for showing right form after browser refresh and
when the user is redirected back after failed login/signup-attemp.

The session-variable are cleared when the user is logged in.

*/

var loginForm  = $("#login-form"),
    signupForm  = $("#signup-form"),
    loginBtn   = $("#showLogIn"),
    signupBtn  = $("#showSignUp");

loginBtn.on("click", function(){
  showLogin();
});

signupBtn.on("click", function(){
  showSignup();
});

function showLogin(){
  signupForm.hide();
  loginForm.show();
  sessionStorage.showForm = "login";
}

function showSignup(){
  loginForm.hide();
  signupForm.show();
  sessionStorage.showForm = "signup";
}

// ================================================
// DOCUMENT READY =================================
// ================================================

$( document ).ready(function() {

  if (!sessionStorage.showForm){
    sessionStorage.showForm = "login";
    showLogin();
  } else if (sessionStorage.showForm === "login") {
    showLogin();
  } else if (sessionStorage.showForm === "signup") {
    showSignup();
  }
});
