functionsObj = {};

functionsObj.dateFormat = function(date){
  var month       = String(date.getMonth()+1),
      day         = String(date.getDate()),
      h           = String(date.getHours()),
      minute      = String(date.getMinutes());


  var dateString  = day + "/" + month + " " + h + ":" + minute;

  return dateString;
}



module.exports = functionsObj;
