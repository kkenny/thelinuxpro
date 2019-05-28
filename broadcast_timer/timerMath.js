
var countDownDate;
var now, distance;
var days, hours, minutes, seconds;
var style = "green"; // reset style
var r;
aLen = events.length;

function countdown(targetDate) {

  countDownDate = new Date(targetDate).getTime();
  now = new Date().getTime();
  distance = countDownDate - now;


  days = Math.floor(distance / (1000 * 60 * 60 * 24));
  hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  seconds = Math.floor((distance % (1000 * 60)) / 1000);


// Day or Days?
  if (days > 0) {
    if (days == 1){
      days = (days + ' Day ');
    } else {
      days = (days + ' Days ');
    }
  } else {
    days = '';
  }

// set style for countdown based on remaining time
  style = "green"; // reset style

  if (days < 1 && hours < 1) {
    //console.log(`in days and hours if statment`)
    //console.log(`days = ${days} , hours = ${hours} , minutes = ${minutes}`)
    if (minutes < 0) {
      style = 'over';
    } else if (minutes < 15) {
      style = 'warn';
    } else {
      style = 'green';
    }
  }

  //console.log(`Style = ${style}`)

// pad single digits with a '0' prefix
// when time is out, start counting up by inverting
  if (hours < 0) {
    hours = (-hours);
  }
  if (hours < 10 && hours >= 0) {
    hours = ('0' + hours);
  }

  if (minutes < 0) {
    minutes = (-minutes);
  }
  if (minutes < 10 && minutes >= 0) {
    minutes = ('0' + minutes);
  }

  if (seconds < 0) {
    seconds = (-seconds);
  }
  if (seconds < 10 && seconds >= 0) {
    seconds = ('0' + seconds);
  }

  var r = "<div class=" + style + ">" + days + hours + ":" + minutes + ":" + seconds + "</div>";

  return r;
}

