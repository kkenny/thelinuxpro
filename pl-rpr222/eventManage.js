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
			getJson();
		}
	};

	req.open("PUT", jsonUrl, true);
	req.setRequestHeader("Content-type", "application/json");
	req.send(data);
}

function getJson() {

//	var GoogleAuth = gapi.auth2.init();
//	if (GoogleAuth.isSignedIn.get() === true) {
		displayMeta();
		console.log(`getJson`);
		let req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState == XMLHttpRequest.DONE) {
				window.punches = JSON.parse(req.responseText);
				window.punches.sort(function(a, b){return a.priority - b.priority});
				//callback(window.punches);
				genStatuses(window.punches);
			}
		};

		req.open("GET", jsonUrl, true);
		req.send();
//	} else {
//		console.log('not logged in');
//	}
}

function findArrayId(uid) {
	var length = window.punches.length;

	for (x = 0; x < length; x++) {
		if (window.punches[x].uuid === uid) {
			return x;
		}
	}
}

function tagFilter(tagItem) {
	console.log(`In tagFilter function`);
	window.tagFilterItem = tagItem;
	getJson();
}

function clearTagFilter() {
	console.log(`Clear Tags`);
	window.tagFilterItem = undefined;
	getJson();
}

function getStatus(punchList, statusFilter) {
	return punchList.filter(function(punch) { return punch.progress.toLowerCase() === statusFilter; });
}

function genStatuses(punchList) {
	genList(getStatus(punchList, "in progress"), "punchListInProgress");
	genList(getStatus(punchList, "new"), "punchListNew");
	genList(getStatus(punchList, "done"), "punchListDone");
}

function genList(punchList, element) {
	document.getElementById("showDone").innerHTML = "Show Done: <a href='#' onClick='toggleShowDone()'>" + showDone + "</a>";
	console.log(`current tag = ${window.tagFilterItem}`);

	disableElement("punchDetail");
	enableElement("punchListAll");
	var itemStyle = "punches";
//	isItArray(punchList);

//	punchList.sort(function(a, b){return new Date(a.date).getTime() - new Date(b.date).getTime()});
	listLength = punchList.length;

	var list = '';

	for (i = 0; i < listLength; i++) {
		if (window.tagFilterItem != undefined) {
		if (punchList[i].tags != undefined && punchList[i].tags.includes(window.tagFilterItem)) {
			console.log(`in tagFilterIf`);
			list += "<div class='punchlist top-bottom-border'>"; //
			list += "<div class='punchlist container top-bottom-border'>"; //
			list += "<div class='ten columns'>";
			list += "<div class='12 columns " + itemStyle + "' onClick=enablePunchDetail(\"" + punchList[i].uuid + "\")><span class=subject>" + punchList[i].subject + "</span></div>"; //
			list += "<div class='three columns " + itemStyle + "'>Status: " + punchList[i].progress + "</div>";
			list += "<div class='two columns " + itemStyle + "'>Priority: " + punchList[i].priority + "</div>";
			list += "<div class='four columns " + itemStyle + "'>Need By: " + punchList[i].nDate + "</div>";

			if (punchList[i].tags != undefined) {
				list += "<div class='four columns " + itemStyle + "'>Tags: ";
				for (t = 0; t < punchList[i].tags.length; t++) {
					list += "<a href='#' onClick(tagFilter(" + punchList[i].tags[t] + ")>" + punchList[i].tags[t] + "</a>, ";
				}
				list += "</div>";
			}
			list += "</div>";
			list += "<div class='two columns'>";
			list += "<div class=dropdown>";
			list += "<button class=dropbtn onClick=dropMenu(\"" + punchList[i].uuid + "\")>Act<i class='fa fa-caret-down'></i></button>";
			list += "<div class=dropdown-content id='myDropdown" + punchList[i].uuid + "'>";
			list += "<a onClick=startPunch(\"" + punchList[i].uuid + "\")>start</a>";
			list += "<a onClick=completePunch(\"" + punchList[i].uuid + "\")>done</a>";
			list += "<a onClick=editPunch(\"" + punchList[i].uuid + "\")>edit</a>";
			list += "<a onClick=deletePunch(\"" + punchList[i].uuid + "\")>delete</a>";
			list += "</div></div></div></div></div>";
		}
		} else {
			console.log(`in tagFilterElse`);
			list += "<div class='punchlist top-bottom-border'>"; //
			list += "<div class='punchlist container top-bottom-border'>"; //
			list += "<div class='ten columns'>";
			list += "<div class='12 columns " + itemStyle + "' onClick=enablePunchDetail(\"" + punchList[i].uuid + "\")><span class=subject>" + punchList[i].subject + "</span></div>"; //
			list += "<div class='three columns " + itemStyle + "'>Status: " + punchList[i].progress + "</div>";
			list += "<div class='two columns " + itemStyle + "'>Priority: " + punchList[i].priority + "</div>";
			list += "<div class='four columns " + itemStyle + "'>Need By: " + punchList[i].nDate + "</div>";

			if (punchList[i].tags != undefined) {
				list += "<div class='four columns " + itemStyle + "'>Tags: ";
				for (t = 0; t < punchList[i].tags.length; t++) {
					list += "<a href='#' onClick=tagFilter(\"" + punchList[i].tags[t] + "\")>" + punchList[i].tags[t] + "</a>, ";
				}
				list += "</div>";
			}
			list += "</div>";
			list += "<div class='two columns'>";
			list += "<div class=dropdown>";
			list += "<button class=dropbtn onClick=dropMenu(\"" + punchList[i].uuid + "\")>Act<i class='fa fa-caret-down'></i></button>";
			list += "<div class=dropdown-content id='myDropdown" + punchList[i].uuid + "'>";
			list += "<a onClick=startPunch(\"" + punchList[i].uuid + "\")>start</a>";
			list += "<a onClick=completePunch(\"" + punchList[i].uuid + "\")>done</a>";
			list += "<a onClick=editPunch(\"" + punchList[i].uuid + "\")>edit</a>";
			list += "<a onClick=deletePunch(\"" + punchList[i].uuid + "\")>delete</a>";
			list += "</div></div></div></div></div>";
		}
	}

	document.getElementById(element).innerHTML = list;

	if (showDone === false) {
		disableElement("punchListDoneWrapper");
	} else {
		enableElement("punchListDoneWrapper");
	}

}

function startPunch(uuid) {
	var punchList = window.punches;
	item = findArrayId(uuid);
	punchList[item].progress = "In Progress";

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
}

function completePunch(uuid) {
	var punchList = window.punches;
	item = findArrayId(uuid);
	punchList[item].progress = "Done";

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
}

function enablePunchDetail(uuid) {
	var punchList = window.punches;
	item = findArrayId(uuid);
	console.log(`inside enablePunchDetail`);
	disableElement("punchListAll");
	enableElement("punchDetail");
//	html = "";
	html = "<p>subject: " + punchList[item].subject + "<br />Created: " + punchList[item].cDate + "<br />Modified Date: " + punchList[item].mDate + "<br />Priority: " + punchList[item].priority + "<br />Progress: " + punchList[item].progress + "<br /><textarea>" + punchList[item].notes + "</textarea><br /><input onfocus='clearDefault(this)' type='text' id='tag' value='Add tag'><input onClick='addTag()' type=button value='Add' /></p><input type=button value=close onClick=getJson()>";
	document.getElementById("punchDetail").innerHTML = html;
}

function createNewEvent() {
	/* Before doing this,
			Refresh the array,
			So that we don't overwrite data */
getJson();

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

	var newEventJson = { uuid: genUid(), nDate: nDateField, subject: subjectField, priority: priorityField, progress: progressField, notes: notesField };
	punchList.push(newEventJson);
	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
	disableElement("newEvent");
	enableElement("punchListAll");
//	document.getElementById("newEventList").innerHTML = jsonStr;
}

function genDaily() {
	/* Before doing this,
			Refresh the array,
			So that we don't overwrite data */
getJson();

	punchList = window.punches;

	var daily = [ "Check Workday", "Check Expenses", "Check Change Cases", "Check TD's", "Check at-mentions" ];
	console.log(`${daily[1]}`);

	for (x = 0; x < daily.length; x++) {
		var newEventJson = { uuid: genUid(), nDate: "EOD", subject: daily[x], priority: "1", progress: "new", notes: "", tags: [ "work", "daily", "today" ] };
		punchList.push(newEventJson);
		jsonStr = JSON.stringify(punchList);
		putJson(jsonStr);
	}
}

function genWeekly() {
	/* Before doing this,
			Refresh the array,
			So that we don't overwrite data */
getJson();

	punchList = window.punches;

	var weekly = [ "Update ORB Notes", "Prep Weekly Meeting", "Build out Broadcast Timer" ];

	for (x = 0; x < weekly.length; x++) {
		var newEventJson = { uuid: genUid(), nDate: "Tuesday", subject: weekly[x], priority: "1", progress: "new", notes: "", tags: [ "work", "weekly" ] };
		punchList.push(newEventJson);
		jsonStr = JSON.stringify(punchList);
		putJson(jsonStr);
	}
}

function deletePunch(uuid) {
	/* Before doing this,
			Refresh the array,
			So that we don't overwrite data */
getJson();

//	console.log(`${punchList}`);
//	console.log(`${window.punches}`);
	punchList = window.punches;
	item = findArrayId(uuid);

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

function displayMeta() {
	document.getElementById("meta").innerHTML = "Version: " + version ;
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropMenu(item) {
	window.dropId = "myDropdown" + item;
  document.getElementById(window.dropId).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
  var myDropdown = document.getElementById(window.dropId);
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
  }
}

function toggleShowDone() {
	if (showDone === false) {
		window.showDone = true;
	} else if (showDone === true) {
		window.showDone = false;
	} else {
		window.showDone = false;
	}
	getJson();
}

function editPunch(uuid) {
	/* Before doing this,
			Refresh the array,
			So that we don't overwrite data */
getJson();

	disableElement("newEvent");
	disableElement("punchListAll");
	enableElement("editPunch");

	punchList = window.punches;
	item = findArrayId(uuid);

	var id = item;

	var subject = punchList[id].subject;
	var priority = punchList[id].priority;
	var progress = punchList[id].progress;
	var nDate = punchList[id].nDate;
	var notes = punchList[id].notes;

	document.getElementById("editID").value = id;
	document.getElementById("editSubject").value = subject;
	document.getElementById("timepickerEdit").value = nDate;
	document.getElementById("editNotes").value = notes;
	document.getElementById("editProgress").value = progress;
	document.getElementById("editPriority").value = priority;
}

function submitEditPunch() {
	punchList = window.punches;

	var id = document.getElementById("editID").value;
	var subjectField = document.getElementById("editSubject").value;
	var priorityField = document.getElementById("editPriority").value;
	var progressField = document.getElementById("editProgress").value;
	var nDateField = document.getElementById("timepickerEdit").value;
	var notesField = document.getElementById("editNotes").value;

	punchList[id].subject = subjectField;
	punchList[id].priority = priorityField;
	punchList[id].progress = progressField;
	punchList[id].nDate = nDateField;
	punchList[id].notes = notesField;

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
	disableElement("editPunch");
}

function addTag() {
	/* Before doing this,
			Refresh the array,
			So that we don't overwrite data */
getJson();

	var item = document.getElementById("editID").value;
	var newTag = document.getElementById("tag").value.toLowerCase();

	console.log(`Item: ${item}`);
	console.log(`New Tag: ${newTag}`);
	// make sure tags object exists
	if (punchList[item].tags === undefined) {
		console.log(`Adding tags object to punchList[${item}]`);
		punchList[item].tags = [];
	}

	punchList[item].tags.push(newTag);
	console.log(`${punchList[item].tags}`);

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
	disableElement("editPunch");
	enableElement("punchListAll");
}

function clearDefault(a){
	if (a.defaultValue == a.value) {
		a.value="";
	}
}

function genUid() {
	function chr4() {
		return Math.random().toString(16).slice(-4);
	}
	return chr4() + chr4() +
	'-' + chr4() +
	'-' + chr4() +
	'-' + chr4() +
	'-' + chr4() + chr4() + chr4();
}

//google stuff
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	getJson();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}


