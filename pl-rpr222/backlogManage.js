var punches, punchList, listLength, object;

console.log(version);

function isItArray(object) {
	console.log(`is ${object} Array = ${Array.isArray(object)}`);
//	return Array.isArray(object);
}

function putJson(data) {
	let req = new XMLHttpRequest();

	req.onreadystatechange = () => {
		if (req.readyState == XMLHttpRequest.DONE) {
			//document.getElementById("result").innerHTML = new Date().getTime() + " - " + req.status;
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
		//displayMeta();
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
	return punchList.filter(function(punch) { return punch.progress.toLowerCase() != statusFilter; });
}

function genStatuses(punchList) {
//	genList(getStatus(punchList, "in progress"), "punchListInProgress");
//	genList(getStatus(punchList, "new"), "punchListNew");
	genList(getStatus(punchList, ""), "punchListBacklog");
}

function genBacklog(punchList) {
	genList(punchList, "punchListBacklog");
}

function genList(punchList, element) {
	enableElement("punchListAll");
	var itemStyle = "punches";
//	isItArray(punchList);

//	punchList.sort(function(a, b){return new Date(a.date).getTime() - new Date(b.date).getTime()});
	listLength = punchList.length;

	var list = '<ol id="sortable">';

	for (i = 0; i < listLength; i++) {
		if (punchList[i].progress.toLowerCase() === "in progress") { var style = "inProgress" } else { var style = "punch-default" }
		if (punchList[i].progress.toLowerCase() === "done" && punchList[i].priority != 99999) {
			setPriority(punchList[i].uuid, 99999);
		} else if (punchList[i].progress.toLowerCase() != "done"){
			list += '<li class="' + style + '"><div class="portlet"><div class="backlog-list-header">' + punchList[i].priority + '<div class=subject>' + punchList[i].subject + '</div></div><div class="backlog-list-content"><div style="punch-list-backlog-details">' + punchList[i].progress + '<br /> Created:' + punchList[i].cDate + '<br /> Modified: ' + punchList[i].mDate + '<br /><textarea>' + punchList[i].notes + '</textarea><br /><input onfocus="clearDefault(this)" type="text" id="tag" value="Add tag"><input onClick="addTag()" type=button value="Add" /> </div></div></div></div></li>';
		}
	}

	list += "</ol>";
	document.getElementById(element).innerHTML = list;

mkSortable();
}

function mkSortable() {
	punchList = window.punches;

	$( function() {
		$( "#sortable" ).sortable({
			cancel: ".portlet-toggle",
			placeholder: "portlet-placeholder ui-corner-all",
			start: function(event, ui) {
				window.sortObjectUUID = punchList[ui.item.index()].uuid;
				console.log(`Start Position: ${ui.item.index()}`);
			},
			stop: function(event, ui) {
				setPriority(window.sortObjectUUID, ui.item.index());
				console.log(`New Position: ${ui.item.index()}`);
			}
		});

    $( ".portlet" )
      .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
      .find( ".backlog-list-header" )
        .addClass( "ui-widget-header ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $( ".portlet-toggle" ).on( "click", function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".backlog-list-content" ).toggle();
    });
		$( "#sortable" ).disableSelection();
	} );
}

function setPriority(sortObject, newPosition) {
	var punchList = window.punches;
	item = findArrayId(sortObject);

	for (i = 0; i < punchList.length; i++) {
		if (punchList[i].priority < 100 && punchList[i].priority >= newPosition && punchList[i].uuid != punchList[item].uuid) {
			punchList[i].priority = i;
		}
	}

	punchList[item].priority = newPosition;

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
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
//  var profile = googleUser.getBasicProfile();
//  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//  console.log('Name: ' + profile.getName());
//  console.log('Image URL: ' + profile.getImageUrl());
//  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
//	getJson();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

getJson();

$('li').on("click", function(event){
  var target = event.target,
      index = $(target).index();
    console.log(target, index);
    document.getElementById("debug1").innerHTML = target + "<br />" + index;
});
