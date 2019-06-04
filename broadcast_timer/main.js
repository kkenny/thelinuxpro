// meta
var version = "0.11.121"
var debug = true;

var dataLoad = false;
var dataRequested = false;
var jsonUrl = "https://api.myjson.com/bins/k0abr";
var events, list, counter_diff, eventLength, isEventsArray;
var currentObject, nextObject, notes;
var currentDate, nextDate, currentStart, currentEnd;
var nextStart, nextEnd, currentSubject, nextSubject;

var initialized = false;
var style = 'green';
var eventStyle = "events";
var array_counter = 0;


console.log(`start js`);

function getEvents() {
	console.log(`start getEvents function`);

	let req = new XMLHttpRequest();


	req.onreadystatechange = () => {
		console.log(`${req.readyState}`);
		console.log(`${XMLHttpRequest.DONE}`);
		if (req.readyState == XMLHttpRequest.DONE) {
			console.log(`request done`);
			let dataLoad = true;
			//var events = JSON.parse(JSON.stringify(req.responseText));
			let events = JSON.parse(req.responseText);
			let eventsLength = events.length;
			console.log(`indside req.onreadystatechange`);
			console.log(`${events}`);
			console.log(`calling main function`);

			main(events, dataLoad, eventsLength);
		}
	};

	console.log(`requesting ${jsonUrl}`);
	req.open("GET", jsonUrl , true);
	req.send();
}

//sleep function
function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}

function toggleDebug() {
  if (debug === true) {
    debug = false;
    document.getElementById("debug").innerHTML = "";
  } else {
    debug = true;
  }
}

function selectEvent(id) {
	console.log(`inside selectEvent()`);

	currentObject = id;
	array_counter = id;
	currentDate = events[currentObject].date;
	currentSubject = events[currentObject].subject;
	currentStart = currentDate;
	currentEnd = nextDate;
	nextObject = array_counter + 1;
	if (nextObject >= eventsLength) {
		nextStart = "";
		nextEnd = "";
		nextDate = "";
		nextSubject = "End";
		notes = "";
	} else {
		nextStart = nextDate;
		nextEnd = events[nextObject].date;
		nextDate = events[nextObject].date;
		nextSubject = events[nextObject].subject;
		notes = events[currentObject].notes;
	}

	document.getElementById("notes").innerHTML = notes;
	document.getElementById("currentSubject").innerHTML = "Now: " + currentSubject;
	document.getElementById("upNext").innerHTML = "Next: " + nextSubject;
	document.getElementById("currentStartEnd").innerHTML = "Start Time: " + currentDate + "<br />End Time: " + currentEnd;
	document.getElementById("nextStartEnd").innerHTML = "Start Time: " + nextDate + "<br />End Time: " + nextEnd;
	countDownDate = new Date(nextDate).getTime();
	currentTimer = new Date(currentDate).getTime();
}

function incArray() {
	console.log("inside incArray");
	console.log(`array_counter = ${array_counter}`);
	console.log(`eventsLength = ${eventsLength}`);
	console.log(`events = ${events}`);
	if (array_counter < eventsLength) {
		array_counter++;
	}
	selectEvent(array_counter);
}

function decArray() {
	console.log("inside decArray");
	console.log(`array_counter = ${array_counter}`);
	console.log(`eventsLength = ${eventsLength}`);
	console.log(`events = ${events}`);

	if (array_counter > 0) {
		array_counter--;
	}
	selectEvent(array_counter);
}

function genList() {
	console.log(`inside gen list `);
	list = "<table class=events><th class=events>Event</th><th class=events>Time</th><th class=events>Time Until</th>";

	if (eventsLength > 15) {
		var listLength = 15;
		var page = true;
	} else {
		var listLength = eventsLength;
	}

	var count_to_end = eventsLength - array_counter;

	for (i = 0; i < listLength; i++) {
		if (i === array_counter) {
			eventStyle = "events-current";
			cdFunction = countdown(events[i].date, events[i + 1],  "current");
		} else {
			eventStyle = "events";
			cdFunction = countdown(events[i].date, "", "next");
		}

		counter_diff = i - array_counter;

		if (counter_diff < -2) {
			list += '';
			if (listLength < eventsLength) {
				listLength++;
			}
		} else {
			list += "<tr onClick=selectEvent(\"" + i + "\")><td class=" + eventStyle + ">" + events[i].subject + "</td><td class=" + eventStyle + ">" + events[i].date + "</td><td class=" + eventStyle + ">" + cdFunction + "</td></tr>";
	  }
	}

	list += "</table>";

	return list;
}

function main(array, dataLoad, aLen) {
	events = array;
	isEventsArray = Array.isArray(events);
	eventsLength = aLen;

	console.log(`inside main`);
	console.log(`events = ${events}`);
	console.log(`dataLoad = ${dataLoad}`);
	console.log(`${isEventsArray}`);

	events.sort(function(a, b){return new Date(a.date).getTime() - new Date(b.date).getTime()});


//console.log(`eventsLength = ${eventsLength}`);
	currentObject = array_counter;
	nextObject = array_counter + 1;
	notes = events[currentObject].notes;
	currentDate = events[currentObject].date;
	nextDate = events[nextObject].date;
	currentStart = currentDate;
	currentEnd = nextDate;
	nextStart = nextDate;
	nextEnd = events[(nextObject + 1)].date;
	currentSubject = events[currentObject].subject;
	nextSubject = events[nextObject].subject;

console.log(`nextObject = ${nextObject}`);
console.log(`notes = ${notes}`);
console.log(`currentDate = ${currentDate}`);
console.log(`nextDate = ${nextDate}`);

	// Set the date we're counting down to
	var countDownDate = new Date(nextDate).getTime();
	var currentTimer = new Date(currentDate).getTime();

	// initialize html objects
	document.getElementById("notes").innerHTML = notes;
	document.getElementById("currentSubject").innerHTML = "Now: " + currentSubject;
	document.getElementById("upNext").innerHTML = "Next: " + nextSubject;
	document.getElementById("currentStartEnd").innerHTML = "Start Time: " + currentDate + "<br />End Time: " + currentEnd;
	document.getElementById("nextStartEnd").innerHTML = "Start Time: " + nextDate + "<br />End Time: " + nextEnd;

	// Update the count down every 1 second
	var x = setInterval(function() {

	  document.getElementById("meta").innerHTML = "Version: " + version + "<br />Debug: <a onclick=toggleDebug()>" + debug + "</a>";
	  document.getElementById("events-list").innerHTML = genList();

	// A regular clock
	  document.getElementById("calDate").innerHTML = clock_cal_date();
	  document.getElementById("now").innerHTML = clock_date();
	  document.getElementById("utc_now").innerHTML = clock_dateUTC();

	//
	  document.getElementById("countdown").innerHTML = countdown(currentDate, "current");
	  document.getElementById("nextCountdown").innerHTML = countdown(nextDate, "next");

	  if (debug === true) {
			debugString  = "debug: " + debug + "<br />Version: " + version ;
			debugString += "<br />Current time object: " + currentDate + "<br />Current subject object: " + currentSubject ;
			debugString += "<br />current notes object: " + notes + "<br />next time object: " + nextDate ;
			debugString += "<br />next subject object: " + nextSubject + "<br />current array counter: " + array_counter ;
			debugString += "<br />Start Time: " + currentStart + "<br />End Time: " + currentEnd + "<br />" ;
	  document.getElementById("debug").innerHTML = debugString;
		}
	}, 1000);
}

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

var countDownDate;
var now, distance;
var days, hours, minutes, seconds;
var style = "green"; // reset style
var r;

function countdown(targetDate, nextDate, current) {
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

// set style for countdown based on remaining time
	style = "green"; // reset style

	if (current === "current") {
		style = 'current';
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

	if (days < 0) {
		days = (-days);
		days--;
	}

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


