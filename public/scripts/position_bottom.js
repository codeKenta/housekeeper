
// =====================================================
// =====================================================
// FUNCTION - Position element to bottom of window
// Position element into fixed position by subtracts
// element height from window height
// =====================================================
// =====================================================
function positionElementBottom(element){

  var containerWidth = $(".top-container").css("width");

  // Gets the elements height from css
  var elementHeightCss = element.css("height");

  // Splits the string with the height (removes the "px")
  // and return the height as number
  var heightNum = Number(elementHeightCss.split("px")[0]);

  // Subtracts the element height from window height
  var position = $( window ).height() - heightNum;

  // Makes the position into string ready to use for
  // position the element
  var positionCssString = String(position) + "px";

  // Position the element
  element.css("top", positionCssString);
  element.css("width", containerWidth);
}

// Element to position
var changeStatusElement = $(".change-status");

// Position the element on document load.
$(document).ready(function() {
    positionElementBottom(changeStatusElement);
});

// Re-position the element on window resize
$(window).resize(function() {
  positionElementBottom(changeStatusElement);
});
