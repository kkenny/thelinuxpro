// meta
var version = "0.9.112"
var debug = false;

var style = 'green';
var eventStyle = "events";

var list;
var counter_diff;

var eventsLength = events.length;

var array_counter = 0;
var currentObject = array_counter;
var nextObject = array_counter + 1;

var notes = events[currentObject].notes;
var currentDate = events[currentObject].date;
var nextDate = events[nextObject].date;
var currentStart = currentDate;
var currentEnd = nextDate;
var nextStart = nextDate;
var nextEnd = events[(nextObject + 1)].date;
var currentSubject = events[currentObject].subject;
var nextSubject = events[nextObject].subject;

// Set the date we're counting down to
var countDownDate = new Date(nextDate).getTime();
var currentTimer = new Date(currentDate).getTime();

// initialize html objects
document.getElementById("notes").innerHTML = notes;
document.getElementById("currentSubject").innerHTML = "Now: " + currentSubject;
document.getElementById("upNext").innerHTML = "Next: " + nextSubject;
document.getElementById("currentStartEnd").innerHTML = "Start Time: " + currentDate + "<br />End Time: " + currentEnd;
document.getElementById("nextStartEnd").innerHTML = "Start Time: " + nextDate + "<br />End Time: " + nextEnd;

function toggleDebug() {
  if (debug === true) {
    debug = false;
    document.getElementById("debug").innerHTML = "";
  } else {
    debug = true;
  }
}


function incArray() {
  if (array_counter < eventsLength) {
    array_counter++;
  }
  currentObject = array_counter;
  currentDate = events[currentObject].date;
  currentSubject = events[currentObject].subject;
  currentStart = currentDate;
  currentEnd = nextDate;
  nextStart = nextDate;
  nextEnd = events[(nextObject + 1)].date;

  nextObject = array_counter + 1;
  nextDate = events[nextObject].date;
  nextSubject = events[nextObject].subject;
  notes = events[currentObject].notes;

  document.getElementById("notes").innerHTML = notes;
  document.getElementById("currentSubject").innerHTML = "Now: " + currentSubject;
  document.getElementById("upNext").innerHTML = "Next: " + nextSubject;
  document.getElementById("currentStartEnd").innerHTML = "Start Time: " + currentDate + "<br />End Time: " + currentEnd;
  document.getElementById("nextStartEnd").innerHTML = "Start Time: " + nextDate + "<br />End Time: " + nextEnd;
  countDownDate = new Date(nextDate).getTime();
  currentTimer = new Date(currentDate).getTime();
}

function decArray() {
  if (array_counter > 0) {
    array_counter--;
  }

  currentObject = array_counter;
  nextObject = array_counter + 1;
  currentDate = events[currentObject].date;
  nextDate = events[nextObject].date;
  currentSubject = events[currentObject].subject;
  nextSubject = events[nextObject].subject;
  currentStart = currentDate;
  currentEnd = nextDate;
  nextStart = nextDate;
  nextEnd = events[(nextObject + 1)].date;
  notes = events[currentObject].notes;

  nextObject = array_counter + 1;
  nextDate = events[nextObject].date;
  nextSubject = events[nextObject].subject;

  document.getElementById("notes").innerHTML = notes;
  document.getElementById("currentSubject").innerHTML = "Now: " + currentSubject;
  document.getElementById("upNext").innerHTML = "Next: " + nextSubject;
  document.getElementById("currentStartEnd").innerHTML = "Start Time: " + currentDate + "<br />End Time: " + currentEnd;
  document.getElementById("nextStartEnd").innerHTML = "Start Time: " + nextDate + "<br />End Time: " + nextEnd;
  countDownDate = new Date(nextDate).getTime();
  currentTimer = new Date(currentDate).getTime();
}

// Update the count down every 1 second
var x = setInterval(function() {

  document.getElementById("meta").innerHTML = "Version: " + version + "<br />Debug: <a onclick=toggleDebug()>" + debug + "</a>";

  list = "<table class=events><th class=events>Event</th><th class=events>Time</th><th class=events>Time Until</th>";

  if (eventsLength > 20) {
    var listLength = 20;
    var page = true;
  } else {
    var listLength = eventsLength;
  }

  var count_to_end = eventsLength - array_counter;


  for (i = 0; i < listLength; i++) {

    if (i === array_counter) {
      eventStyle= "events-current";
    } else {
      eventStyle = "events";
    }

    counter_diff = i - array_counter;

    if (counter_diff < -2) {
      list += '';
      if (listLength < eventsLength) {
      	listLength++;
      }
    } else {
      list += "<tr><td class=" + eventStyle + ">" + events[i].subject + "</td><td class=" + eventStyle + ">" + events[i].date + "</td><td class=" + eventStyle + ">" + countdown(events[i].date) + "</td></tr>";
    }
  }

  list += "</table>";
  document.getElementById("events-list").innerHTML = list;

// A regular clock

  document.getElementById("calDate").innerHTML = clock_cal_date();
  document.getElementById("now").innerHTML = clock_date();
  document.getElementById("utc_now").innerHTML = clock_dateUTC();

//
  document.getElementById("countdown").innerHTML = countdown(currentDate);
  document.getElementById("nextCountdown").innerHTML = countdown(nextDate);

  if (debug === true) {
    document.getElementById("debug").innerHTML = "debug: " + debug + "<br />Version: " + version + "<br />Current time object: " + currentDate + "<br />Current subject object: " + currentSubject + "<br />current notes object: " + notes + "<br />next time object: " + nextDate + "<br />next subject object: " + nextSubject + "<br />current array counter: " + array_counter + "<br />Start Time: " + currentStart + "<br />End Time: " + currentEnd + "<br />" ;
  }

  // If the count down is finished, write some text
  //if (distance < 0) {
  //  clearInterval(x);
  //  document.getElementById("clock").innerHTML = "EXPIRED";
  //}
}, 1000);
