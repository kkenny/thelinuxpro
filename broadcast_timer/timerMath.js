
var countDownDate;
var now, distance;
var days, hours, minutes, seconds;
var style = "green"; // reset style
var r;
aLen = events.length;

function countdown(targetDate, current) {

  countDownDate = new Date(targetDate).getTime();
  now = new Date().getTime();
  distance = countDownDate - now;

  if (current === "current") {
    var nextCountDownDate = new Date(nextDate).getTime();
    var nextDistance = nextCountDownDate - now;
    var nextDays = Math.floor(nextDistance / (1000 * 60 * 60 * 24));
    var nextHours = Math.floor((nextDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var nextMinutes = Math.floor((nextDistance % (1000 * 60 * 60)) / (1000 * 60));
    var nextSeconds = Math.floor((nextDistance % (1000 * 60)) / 1000);
  }

  days = Math.floor(distance / (1000 * 60 * 60 * 24));
  hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  seconds = Math.floor((distance % (1000 * 60)) / 1000);

// Day or Days?
  if (days > 0) {
    if (days === 1){
      rDays = (days + ' Day ');
    } else {
      rDays = (days + ' Days ');
    }
  } else {
    rDays = '';
  }

// set style for countdown based on remaining time
  style = "green"; // reset style

  if (current === "current") {
		style = 'current';
/*    if (nextDays < 1 && nextHours < 1) {
      if (nextMinutes < 0) {
	style = 'over';
      } else if (nextMinutes < 15) {
	style = 'warn';
      } else {
	style = 'green';
      }
    } */
  } else {
    if (days < 1 && hours < 1) {
      if (minutes < 0) {
	style = 'over';
      } else if (minutes < 15) {
	style = 'warn';
      } else {
	style = 'green';
      }
    }
  }

// pad single digits with a '0' prefix
// when time is out, start counting up by inverting
  if (hours < 0) {
    hours = (-hours);
    hours--;
  }
  if (hours < 10 && hours >= 0) {
    hours = ('0' + hours);
  }

  if (minutes < 0) {
    minutes = (-minutes);
    minutes--;
  }
  if (minutes < 10 && minutes >= 0) {
    minutes = ('0' + minutes);
  }

  if (seconds < 0) {
    seconds = (-seconds);
    seconds--;
  }
  if (seconds < 10 && seconds >= 0) {
    seconds = ('0' + seconds);
  }

  if (initialized === false && distance < 0) {
    incArray();
  } else if (initialized === false) {
    initialized = true;
    decArray();
  }

  var r = "<div class=" + style + ">" + rDays + hours + ":" + minutes + ":" + seconds + "</div>";
  return r;
}

