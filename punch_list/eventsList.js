var initialized = false;

function getEvents() {
	let req = new XMLHttpRequest();

	req.onreadystatechange = () => {
		console.log(`${req.readyState}`);
		console.log(`${XMLHttpRequest.DONE}`);
		if (req.readyState == XMLHttpRequest.DONE) {
			console.log(`request done`);
			let dataLoad = true;
			window.eventsList = JSON.parse(req.responseText);
			window.eventsLength = eventsList.length;
			main(window.eventsList, dataLoad, window.eventsLength);
		}
	};
	req.open("GET", btJsonUrl , true);
	req.send();
}

//sleep function
function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}

function selectEvent(id) {
	var events = window.eventsList;
	console.log(`inside selectEvent()`);

	currentObject = id;
	array_counter = id;
	currentDate = events[currentObject].date;
	currentSubject = events[currentObject].subject;
	currentStart = currentDate;
	currentEnd = nextDate;
	nextObject = array_counter + 1;
	if (nextObject >= window.eventsLength) {
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

	countDownDate = new Date(nextDate).getTime();
	currentTimer = new Date(currentDate).getTime();
}

function incArray() {
	var events = window.eventsList;
	console.log("inside incArray");
	console.log(`array_counter = ${array_counter}`);
	console.log(`window.eventsLength = ${window.eventsLength}`);
	console.log(`events = ${events}`);
	if (array_counter < window.eventsLength) {
		array_counter++;
	}
	selectEvent(array_counter);
}

function decArray() {
	var events = window.eventsList;
	console.log("inside decArray");
	console.log(`array_counter = ${array_counter}`);
	console.log(`window.eventsLength = ${window.eventsLength}`);
	console.log(`events = ${events}`);

	if (array_counter > 0) {
		array_counter--;
	}
	selectEvent(array_counter);
}

function genEventList() {
	list = "<table class=events><th class=events>Event</th><th class=events>Time</th><th class=events>Time Until</th>";

	var events = window.eventsList;

	if (window.eventsLength > 30) {
		var listLength = 30;
		var page = true;
	} else {
		var listLength = window.eventsLength;
	}

	var count_to_end = window.eventsLength - array_counter;

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
			if (listLength < window.eventsLength) {
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
	var x = setInterval(function() {
		document.getElementById("events-list").innerHTML = genEventList();
	}, 1000);
}

var style = "green"; // reset style

function countdown(targetDate, nextDate, current) {
	var countDownDate = new Date(targetDate).getTime();
	var now = new Date().getTime();
	var distance = countDownDate - now;

	if (current === "current") {
		var nextCountDownDate = new Date(nextDate).getTime();
		var nextDistance = nextCountDownDate - now;
		var nextDays = Math.floor(nextDistance / (1000 * 60 * 60 * 24));
		var nextHours = Math.floor((nextDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var nextMinutes = Math.floor((nextDistance % (1000 * 60 * 60)) / (1000 * 60));
		var nextSeconds = Math.floor((nextDistance % (1000 * 60)) / 1000);
	}

	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

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


