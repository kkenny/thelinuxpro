var punches, punchList, listLength, object;

function isItArray(object) {
	console.log(`is ${object} Array = ${Array.isArray(object)}`);
//	return Array.isArray(object);
}

function putJson(data) {
	let req = new XMLHttpRequest();

	req.onreadystatechange = () => {
		if (req.readyState == XMLHttpRequest.DONE) {
			document.getElementById("result").innerHTML = new Date().getTime() + " - " + req.status;
			getJson(genList);
		}
	};

	req.open("PUT", jsonUrl, true);
	req.setRequestHeader("Content-type", "application/json");
	req.send(data);

}

function getJson(callback) {
	console.log(`getJson`);
	let req = new XMLHttpRequest();
	req.onreadystatechange = () => {
		if (req.readyState == XMLHttpRequest.DONE) {
			window.punches = JSON.parse(req.responseText);
			window.punches.sort(function(a, b){return a.priority - b.priority});
			callback(window.punches);
		}
	};

	req.open("GET", jsonUrl, true);
	req.send();

}

function genList(punchList) {
	console.log(`inside gen list `);
	disableElement("punchDetail");
	enableElement("punchList");
	var itemStyle = "punches";
	isItArray(punchList);

//	punchList.sort(function(a, b){return new Date(a.date).getTime() - new Date(b.date).getTime()});
	listLength = punchList.length;

	list = "<table id=punchListTable class=punches><th class=punches>Punch Item</th><th class=punches>Status</th><th class=punches>Priority</th><th>Action</th>";

	for (i = 0; i < listLength; i++) {
		list += "<tr onClick=enablePunchDetail(" + i + ")><td onClick=enablePunchDetail(" + i + ") class=" + itemStyle + ">" + punchList[i].subject + "</td><td class=" + itemStyle + ">" + punchList[i].progress + "</td><td class=" + itemStyle + ">" + punchList[i].priority + "</td><td class=" + itemStyle + "><a onClick=startPunch(" + i +")>start</a> | <a onClick=completePunch(" + i + ")>done</a> | <a onClick=editPunch(" + i + ")>edit</a> | <a onClick=deletePunch(" + i + ")>delete</a></td></tr>";
	}

	list += "</table>";
	document.getElementById("punchList").innerHTML = list;
}

function startPunch(item) {
	var punchList = window.punches;
	punchList[item].progress = "In Progress";

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
}

function completePunch(item) {
	var punchList = window.punches;
	punchList[item].progress = "Done";

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
}

function enablePunchDetail(item) {
	var punchList = window.punches;
	console.log(`inside enablePunchDetail`);
	disableElement("punchList");
	console.log(`punchList Disabled`);
	enableElement("punchDetail");
	console.log(`punchDetail Enabled`);
//	html = "";
	html = "<p>subject: " + punchList[item].subject + "<br />Created: " + punchList[item].cDate + "<br />Modified Date: " + punchList[item].mDate + "<br />Priority: " + punchList[item].priority + "<br />Progress: " + punchList[item].progress + "<br /><textarea>" + punchList[item].notes + "</textarea></p><input type=button value=close onClick=getJson(genList)>";
	document.getElementById("punchDetail").innerHTML = html;
}

function createNewEvent() {
//	console.log(`${punchList}`);
//	console.log(`${window.punches}`);
//	disableElement("punchList");
//	disableElement("punchDetail");
	punchList = window.punches;

	var subjectField = document.getElementById("newSubject").value;
	var priorityField = document.getElementById("newPriority").value;
	var progressField = document.getElementById("newProgress").value;
	var nDateField = document.getElementById("timepickerCreate").value;
	var notesField = document.getElementById("newNotes").value;

	var newEventJson = { nDate: nDateField, subject: subjectField, priority: priorityField, progress: progressField, notes: notesField };
	punchList.push(newEventJson);
	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
	disableElement("newEvent");
	enableElement("punchList");
//	document.getElementById("newEventList").innerHTML = jsonStr;
}

function deletePunch(item) {
//	console.log(`${punchList}`);
//	console.log(`${window.punches}`);
	punchList = window.punches;

	console.log(`splicing ${item}`);


	punchList.splice(item, 1);
	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
//	document.getElementById("newEventList").innerHTML = jsonStr;
}


function enableElement(element) {
	console.log(`enabling ${element}`);
	document.getElementById(element).style.display = "block";
}

function disableElement(element) {
	console.log(`disabling ${element}`);
	document.getElementById(element).style.display = "none";
}
