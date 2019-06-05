
function clock_cal_date() {
  var d = new Date();
  var r = d.getFullYear() + "/" + d.getMonth() + "/" + d.getDate();
  return r
}

function clock_date() {

// A regular clock

  var d = new Date();
  var hour = d.getHours();
  var minute = d.getMinutes();
  var second = d.getSeconds();

  if (hour < 10 && hour >= 0) {
    hour = ('0' + hour);
  }

  if (minute < 10 && minute >= 0) {
    minute = ('0' + minute);
  }

  if (second < 10 && second >= 0) {
    second = ('0' + second);
  }

  var r = hour + ":" + minute + ":" + second;
  return r;
}

function clock_dateUTC() {
// Same for UTC
  var d = new Date();
  var hourUTC = d.getUTCHours();
  var minuteUTC = d.getUTCMinutes();
  var secondUTC = d.getUTCSeconds();

  if (hourUTC < 10) {
    hourUTC = ('0' + hourUTC);
  }

  if (minuteUTC < 10) {
    minuteUTC = ('0' + minuteUTC);
  }

  if (secondUTC < 10) {
    secondUTC = ('0' + secondUTC);
  }

  var r = hourUTC + ":" + minuteUTC + ":" + secondUTC;
  return r
}
