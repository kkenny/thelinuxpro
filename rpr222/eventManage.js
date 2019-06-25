var events, eventsList, listLength, object;

function isItArray(object) {
	console.log(`is ${object} Array = ${Array.isArray(object)}`);
//	return Array.isArray(object);
}

function conLog(object) {
	console.log(`${object}`);
}

function test() {
	d = document.getElementById("data").value;
	document.getElementById("result").innerHTML = d;
}

function putJson(data) {
//	var data = document.getElementById("data").value;

	let req = new XMLHttpRequest();

	req.onreadystatechange = () => {
		if (req.readyState == XMLHttpRequest.DONE) {
			document.getElementById("result").innerHTML = new Date().getTime() + " - " + req.status;
			getJson(genList);
		}
	};

	req.open("PUT", "https://api.myjson.com/bins/13hsch", true);
	req.setRequestHeader("Content-type", "application/json");
	req.send(data);

}

function getJson(callback) {
	console.log(`getJson`);
	let req = new XMLHttpRequest();
	req.onreadystatechange = () => {
		if (req.readyState == XMLHttpRequest.DONE) {
			window.events = JSON.parse(req.responseText);
			window.events.sort(function(a, b){return new Date(a.date).getTime() - new Date(b.date).getTime()});
			callback(window.events);
		}
	};

	req.open("GET", "https://api.myjson.com/bins/13hsch", true);
	req.send();

}

function genList(eventsList) {
	console.log(`inside gen list `);
	var eventStyle = "events";
//	isItArray(eventsList);

//	eventsList.sort(function(a, b){return new Date(a.date).getTime() - new Date(b.date).getTime()});
	listLength = eventsList.length;
//	conLog("listLength = " + listLength);

	list = "<table class=events><th class=events>ID</th><th class=events>Event</th><th class=events>Time</th><th></th>";

	for (i = 0; i < listLength; i++) {
		list += "<tr><td class=" + eventStyle + ">" + i + "<td class=" + eventStyle + ">" + eventsList[i].subject + "</td><td class=" + eventStyle + ">" + eventsList[i].date + "</td><td class=" + eventStyle + "><a onClick=deleteEvent(" + i + ")>delete</a>|<a onClick=editEvent(" + i + ")>edit</a></td></tr>";
	}

	list += "</table>";
	document.getElementById("eventList").innerHTML = list;
}

function createNewEvent() {
//	console.log(`${eventsList}`);
//	console.log(`${window.events}`);
	eventsList = window.events;

	var subjectField = document.getElementById("newSubject").value;
	var dateField = document.getElementById("timepickerCreate").value;
	var notesField = document.getElementById("newNotes").value;

	console.log(`${subjectField}`);
	console.log(`${dateField}`);
	console.log(`${notesField}`);

	var newEventJson = { date: dateField, subject: subjectField, notes: notesField };
	eventsList.push(newEventJson);
	jsonStr = JSON.stringify(eventsList);
	putJson(jsonStr);
	disableElement("newEvent");
//	document.getElementById("newEventList").innerHTML = jsonStr;
}

function deleteEvent(item) {
//	console.log(`${eventsList}`);
//	console.log(`${window.events}`);
	eventsList = window.events;

	console.log(`splicing ${item}`);


	eventsList.splice(item, 1);
	jsonStr = JSON.stringify(eventsList);
	putJson(jsonStr);
//	document.getElementById("newEventList").innerHTML = jsonStr;
}

function editEvent(item) {
//	console.log(`${eventsList}`);
//	console.log(`${window.events}`);
	enableElement("editEvent");
	eventsList = window.events;

	console.log(`editing ${item}`);

	var id = item;
	var d = eventsList[item].date;
	var s = eventsList[item].subject;
	var n = eventsList[item].notes;

	document.getElementById("editID").value = id;
	document.getElementById("editSubject").value = s;
	document.getElementById("timepickerEdit").value = d;
	document.getElementById("editNotes").value = n;
}

function submitEditEvent() {
//	console.log(`${eventsList}`);
//	console.log(`${window.events}`);
	eventsList = window.events;

	var id = document.getElementById("editID").value;
	var s = document.getElementById("editSubject").value;
	var d = document.getElementById("timepickerEdit").value;
	var n = document.getElementById("editNotes").value;

	eventsList[id].date = d;
	eventsList[id].subject = s;
	eventsList[id].notes = n;

	jsonStr = JSON.stringify(eventsList);
	putJson(jsonStr);
	disableElement("editEvent");
//	document.getElementById("newEventList").innerHTML = jsonStr;
}

function enableElement(element) {
	document.getElementById(element).style.display = "block";
}

function disableElement(element) {
	document.getElementById(element).style.display = "none";
}

function processEventForm(form) {
	var eventId = document.form.eventID.value;
	var subject = document.form.subject.value;
	var dateTime = document.form.timepicker-actions.value;
	var notes = document.form.notes.value;

	document.getElementById("results").innerHTML = eventId + subject + dateTime + notes;

	if (eventId >= 0) {
		console.log(`eventId = ${eventId}`);
	} else {
		console.log(`eventId = ${eventId}`);
	}
}
