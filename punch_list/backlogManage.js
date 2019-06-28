var punches, punchList, listLength, object;

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
	document.getElementById("versionInfo").innerHTML = '<div class="u-pull-right">' + version + '</div>';
	enableElement("punchListAll");
	var itemStyle = "punches";
//	isItArray(punchList);

//	punchList.sort(function(a, b){return new Date(a.date).getTime() - new Date(b.date).getTime()});
	listLength = punchList.length;

	var list = '<ol id="sortable">';

	var countInProgress = 0;
	var countWaiting = 0;
	var countNew = 0;
	var countDone = 0;
	for (i = 0; i < listLength; i++) {
			if (punchList[i].progress.toLowerCase() === "in progress") { var style = "inProgress"; countInProgress++; }
			else if (punchList[i].progress.toLowerCase() === "waiting") { var style = "waiting"; countWaiting++;}
			else if (punchList[i].progress.toLowerCase() === "new") { var style = "punch-default"; countNew++;}
			else { var style = "punch-default"; countDone++ }

		if (window.tagFilterItem != undefined) {
			console.log('in tags filter');
			if (punchList[i].tags != undefined && punchList[i].tags.includes(window.tagFilterItem)) {
				if (punchList[i].progress.toLowerCase() === "in progress") { var style = "inProgress" } else { var style = "punch-default" }
				if (punchList[i].progress.toLowerCase() === "done" && punchList[i].priority != 99999) {
					setPriority(punchList[i].uuid, 99999);
				} else if (punchList[i].progress.toLowerCase() != "done"){
					list += '<li class="' + style + '">';
					list += '<div class="portlet">';
					list += '<div class="backlog-list-header">';
					list += '<div class="one column">' +punchList[i].priority + '</div><div class="ten columns subject">' + punchList[i].subject + '</div>';
					list += '<div class="three columns"><div class="twelve columns ' + style + '">' + punchList[i].progress + '</div><div class="twelve columns punch-default" style="color: lime" id="timer-' + punchList[i].uuid + '"></div></div>';
					// status dropdown
					list += '<div class="dropdown one column">';
					list += '<img class="top dropbtn" onclick=progressMenuDrop("' + punchList[i].uuid + '") src="images/down-carrot.png">';
					list += '<div id="progressDropdown-' + punchList[i].uuid + '" class="dropdown-content punch-default">';
					list += '<a href="#" onClick=mkPunchNew("' + punchList[i].uuid + '")>New</a>';
					list += '<a href="#" onClick=startPunch("' + punchList[i].uuid + '")>Start</a>';
					list += '<a href="#" onClick=waitingPunch("' + punchList[i].uuid + '")>Waiting</a>';
					list += '<a href="#" onClick=completePunch("' + punchList[i].uuid + '")>Finish</a>';
					list += '</div>';
					list += '</div>';
/*
					if (style === "inProgress") {
						list += '<div class="two columns ' + style + '"><a class="punch-default" href="#" onClick=completePunch("' + punchList[i].uuid + '")>Finish</a></div>';
					} else if (style === "punch-default") {
						list += '<div class="two columns ' + style + '"><a class="punch-default" href="#" onClick=startPunch("' + punchList[i].uuid + '")>Start</a></div>';
					}
*/
					if ( punchList[i].nDate != null && punchList[i].nDate != undefined && punchList[i].nDate != '' ) {
					list += '<div class="three columns punch-default"><div id="neededBy" class="twelve columns punch-default">' + punchList[i].nDate + '</div><div class="twelve columns punch-default" id="countdown-' + punchList[i].uuid + '"></div></div>';
					} else {
						list += '<div class="three columns punch-default">&nbsp;</div>';
					}
					if ( (new Date(punchList[i].nDate).getTime() - new Date().getTime()) <= 0 ) {
						console.log('overdue');
						list += '<div id="neededBy" class="two columns punch-default overdue">OVER DUE</div>';
					} else if ( ((new Date(punchList[i].nDate).getTime() - new Date().getTime()) / 1000) <= 259200 ) {
						console.log('due soon');
						list += '<div id="neededBy" class="two columns punch-default duesoon">DUE SOON</div>';
					} else {
						list += '<div id="neededBy" class="two columns punch-default">&nbsp;</div>';
					}
					if ( punchList[i].tags != undefined ) {
						list += '<div class="four columns punch-default">';
						for (t = 0; t < punchList[i].tags.length; t++) {
							list += '<a class="punch-default" href="#" onClick=tagFilter("' + punchList[i].tags[t] + '")>' + punchList[i].tags[t] + '</a>';
							if ( (t + 1) < punchList[i].tags.length ) {
								list += ", ";
							}
						}
					}
					list += '</div>';
					list += '<div class="backlog-list-content"><div style="punch-list-backlog-details">';
					if ( punchList[i].startTime != undefined ) {
						list += '<div class="three columns punch-default">';
						list += new Date(punchList[i].startTime);
						list += '</div>';
					}
					if ( punchList[i].notes != "" ) {
						list += '<textarea class="edit-text-box" readonly>' + punchList[i].notes + '</textarea><br />';
					}
					list += '<button class="button" onClick=editPunch("' + punchList[i].uuid + '")>edit</button>';
					list += '</div></div></div></li>';
				}
			}
		} else {
			console.log('in no tags filter');

			if (punchList[i].progress.toLowerCase() === "done" && punchList[i].priority != 99999) {
				setPriority(punchList[i].uuid, 99999);
			} else if (punchList[i].progress.toLowerCase() != "done"){
				list += '<li class="' + style + '">';
				list += '<div class="portlet">';
				list += '<div class="backlog-list-header">';
				list += '<div class="one column">' + punchList[i].priority + '</div><div class=subject>' + punchList[i].subject + '</div>';
				list += '<div class="three columns"><div class="twelve columns ' + style + '">' + punchList[i].progress + '</div><div class="twelve columns punch-default" style="color: lime" id="timer-' + punchList[i].uuid + '"></div></div>';
				// status dropdown
				list += '<div class="dropdown two columns">';
				list += '<img class="top dropbtn" onclick=progressMenuDrop("' + punchList[i].uuid + '") src="images/down-carrot.png">';
				list += '<div id="progressDropdown-' + punchList[i].uuid + '" class="dropdown-content punch-default">';
				list += '<a href="#" onClick=mkPunchNew("' + punchList[i].uuid + '")>New</a>';
				list += '<a href="#" onClick=startPunch("' + punchList[i].uuid + '")>Start</a>';
				list += '<a href="#" onClick=waitingPunch("' + punchList[i].uuid + '")>Waiting</a>';
				list += '<a href="#" onClick=completePunch("' + punchList[i].uuid + '")>Finish</a>';
				list += '</div>';
				list += '</div>';
/*
				if (style === "inProgress") {
					list += '<div class="two columns ' + style + '"><a class="punch-default" href="#" onClick=completePunch("' + punchList[i].uuid + '")>Finish</a></div>';
				} else if (style === "punch-default") {
					list += '<div class="two columns ' + style + '"><a class="punch-default" href="#" onClick=startPunch("' + punchList[i].uuid + '")>Start</a></div>';
				}
*/
				if ( punchList[i].nDate != null && punchList[i].nDate != undefined && punchList[i].nDate != '' ) {
					list += '<div class="three columns punch-default"><div id="neededBy" class="twelve columns punch-default">' + punchList[i].nDate + '</div><div class="twelve columns punch-default" id="countdown-' + punchList[i].uuid + '"></div></div>';
				} else {
					list += '<div class="three columns punch-default">&nbsp;</div>';
				}
				if ( (new Date(punchList[i].nDate).getTime() - new Date().getTime()) <= 0 ) {
					console.log('overdue');
					list += '<div id="neededBy" class="two columns punch-default overdue">OVER DUE</div>';
				} else if ( ((new Date(punchList[i].nDate).getTime() - new Date().getTime()) / 1000) <= 259200 ) {
					console.log('due soon');
					list += '<div id="neededBy" class="two columns punch-default duesoon">DUE SOON</div>';
				} else {
					list += '<div id="neededBy" class="two columns punch-default">&nbsp;</div>';
				}
				if ( punchList[i].tags != undefined ) {
					list += '<div class="four columns punch-default">';
					for (t = 0; t < punchList[i].tags.length; t++) {
						list += '<a class="punch-default" href="#" onClick=tagFilter("' + punchList[i].tags[t] + '")>' + punchList[i].tags[t] + '</a>';
						if ( (t + 1) < punchList[i].tags.length ) {
							list += ", ";
						}
					}
				}
				list += '</div>';
				list += '<div class="backlog-list-content"><div style="punch-list-backlog-details">';
				if ( punchList[i].startTime != undefined ) {
					list += '<div class="twelve columns punch-default" style="padding-left: 30px; padding-top: 10px; padding-bottom: 10px;">Started: ';
					list += new Date(punchList[i].startTime);
					list += '</div>';
				}
				if ( punchList[i].notes != "" ) {
					list += '<div class="twelve columns">';
					list += '<textarea class="edit-text-box" readonly>' + punchList[i].notes + '</textarea><br />';
					list += '</div>';
				}
				list += '<button class="button" onClick=editPunch("' + punchList[i].uuid + '")>edit</button>';
				list += '</div></div></div></li>';
			}
		}
	}

	list += "</ol>";
	document.getElementById(element).innerHTML = list;
	document.getElementById("stats").innerHTML = '<div class="ten columns punch-default">Total items:</div><div class="one column punch-default">' + punchList.length;
	document.getElementById("stats").innerHTML += '</div><div class="ten columns punch-default">Blocked items:</div><div class="one column punch-default">' + countWaiting;
	document.getElementById("stats").innerHTML += '</div><div class="ten columns punch-default">In Progress:</div><div class="one column punch-default">' + countInProgress;
	document.getElementById("stats").innerHTML += '</div><div class="ten columns punch-default">New Items:</div><div class="one column punch-default">' + countNew;
	document.getElementById("stats").innerHTML += '</div><div class="ten columns punch-default">Done Items:</div><div class="one column punch-default">' + countDone + '</div>';

mkSortable();
enableDrop();
}

var x = setInterval(function() {
	punchList = window.punches;
	for ( i = 0; i < punchList.length; i++ ) {
		if ( punchList[i].progress.toLowerCase() != "done" && punchList[i].startTime != undefined ) {
			distance = (new Date().getTime() - new Date(punchList[i].startTime).getTime());
			seconds = Math.floor((distance / 1000) % 60);
			minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			days = Math.floor(distance / (1000 * 60 * 60 * 24));

			if (hours < 10) {
				hours = ('0' + hours);
			}
			if (minutes < 10) {
				minutes = ('0' + minutes);
			}
			if (seconds < 10) {
				seconds = ('0' + seconds);
			}

			document.getElementById("timer-" + punchList[i].uuid).innerHTML = days + "day(s), " + hours + ":" + minutes + ":" + seconds;
		}

		if ( punchList[i].progress.toLowerCase() != "done" && punchList[i].nDate != "" ) {
			var style = "punch-list";
			distance = -(new Date().getTime() - new Date(punchList[i].nDate).getTime());
			if ( (distance / 1000) <= 0 ) { style = "overdue" }
			else if ( (distance / 1000) <= 259200 ) { style = "duesoon" }
			seconds = Math.floor((distance / 1000) % 60);
			minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			days = Math.floor(distance / (1000 * 60 * 60 * 24));

			if (days < 0) { days = (days + 1); }
			if (hours < 0)   { hours = (-(hours) - 1); }
			if (minutes < 0) { minutes = -(minutes); }
			if (seconds < 0) { seconds = -(seconds); }

			if (hours < 10)   { hours = ('0' + hours); }
			if (minutes < 10) { minutes = ('0' + minutes); }
			if (seconds < 10) { seconds = ('0' + seconds); }

			document.getElementById("countdown-" + punchList[i].uuid).innerHTML = days + "day(s), " + hours + ":" + minutes + ":" + seconds;
			document.getElementById("countdown-" + punchList[i].uuid).classList.add(style);
		}
	}
}, 1000);

function mainMenuDrop() {
	document.getElementById("mainMenuDropdown").classList.toggle("show");
}

function progressMenuDrop(uuid) {
	document.getElementById("progressDropdown-" + uuid).classList.toggle("show");
}

function enableDrop() {
	window.onclick = function(event) {
		if (!event.target.matches('.dropbtn')) {
			var dropdowns = document.getElementsByClassName("dropdown-content");
			var i;
			for (i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('show')) {
					openDropdown.classList.remove('show');
				}
			}
		}
	}
}

function mkSortable() {
	punchList = window.punches;

	$( function() {
		$( "#sortable" ).sortable({
			cancel: ".portlet-toggle",
			placeholder: "portlet-placeholder ui-corner-all",
			revert: true,
			distance: 50,
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
        .addClass( "ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $( ".portlet-toggle" ).on( "click", function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".backlog-list-content" ).toggle();
    });
		$( "#sortable" ).disableSelection();
	} );

// pop-over dialog
	$( "#dialog" ).dialog({ autoOpen: false });
	$( "#opener" ).click(function() {
		$( "#dialog" ).dialog( "open" );
	});
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

	if ( punchList[item].startTime === undefined ) {
		punchList[item].startTime = new Date().getTime();
	}

	punchList[item].progress = "In Progress";
	punchList[item].priority = 0;

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
}

function completePunch(uuid) {
	var punchList = window.punches;
	item = findArrayId(uuid);

	if ( punchList[item].doneTime === undefined ) {
		punchList[item].doneTime = new Date().getTime();
	}

	punchList[item].progress = "Done";

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
}

function waitingPunch(uuid) {
	var punchList = window.punches;
	item = findArrayId(uuid);

	punchList[item].progress = "Waiting";

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
}

function mkPunchNew(uuid) {
	var punchList = window.punches;
	item = findArrayId(uuid);

	punchList[item].progress = "New";

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

function genEventForm() {

	document.getElementById("newSubject").value = "subject";
	document.getElementById("newPriority").value = "priority";
	document.getElementById("timepickerCreate").value = "date";
	document.getElementById("newNotes").value = '';

	disableElement('punchListAll');
	enableElement('newEvent');
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

	var newTag = document.getElementById("tagsCreate").value.toLowerCase();
	var stripLeadingSpace = newTag.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var newTags = noSpaces.split(",");

	// make sure tags object exists
/*
	if (punchList[item].tags === undefined) {
		console.log(`Adding tags object to punchList[${item}]`);
		punchList[item].tags = [];
	}

	for ( nt = 0; nt < newTags.length; nt++ ) {
		punchList[item].tags.push(newTags[nt]);
		console.log(`${punchList[item].tags}`);
	}
*/

	var newEventJson = { uuid: genUid(), nDate: nDateField, subject: subjectField, priority: priorityField, progress: progressField, tags: newTags, notes: notesField };
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

	disableElement("punchListAll");
	enableElement("editPunch");

	punchList = window.punches;
	item = findArrayId(uuid);

	if ( punchList[item].tags === undefined ) {
		punchList[item].tags = [];
	}

	var id = item;

	var subject = punchList[id].subject;
	var priority = punchList[id].priority;
	var progress = punchList[id].progress;
	var nDate = punchList[id].nDate;
	var notes = punchList[id].notes;
	var tags = punchList[id].tags;

	var html = '<div class="container listWrapper">';
	html += '<input type=hidden id="editID" value="' + uuid + '">';
	html += '<div class="edit-row"><div class="three columns">Subject:</div><div class="nine columns"><input class="twelve columns" type=text id="editSubject" value="' + subject + '"></div></div>';
	html += '<div class="three columns">Priority:</div><div class="nine columns"><input type=text id="editPriority" value="' + priority + '"></div>';
	html += '<div class="three columns">Need By:</div><div class="nine columns"><input type=text id="timepickerEdit" value="' + nDate + '"></div>';
	html += '<div class="three columns">Progress:</div><div id="editProgress" class="nine columns">';
	html +=  progress;
	html += '</div>';
	html += '<div class="three columns">Tags:</div><div class="nine columns">' + tags + '&nbsp; </div>';
	html += '<div class="three columns">Add Tag:</div><div class="nine columns"><input type="text" id="addTag-' + uuid + '"><button onClick=addTag("' + uuid + '")>Add Tag</button></div>';
	html += '<div class="three columns">Notes: </div><div class="nine columns"><textarea class="edit-text-box" id="editNotes">' + notes + '</textarea></div>';
	html += '<button onClick=submitEditPunch("' + uuid + '")>Update</button>';
	html += '<button onClick=\'disableElement("editPunch"),enableElement("punchListAll")\'>Close</button>';
	html += '</div>';

	document.getElementById("editPunch").innerHTML = html;

}

function submitEditPunch(uuid) {
	punchList = window.punches;

//	var uuid = document.getElementById("editID").value;
	var id = findArrayId(uuid);
	var subjectField = document.getElementById("editSubject").value;
	var priorityField = document.getElementById("editPriority").value;
	var progressField = document.getElementById("editProgress").innerHTML;
	var nDateField = document.getElementById("timepickerEdit").value;
	//var tagsField = document.getElementById("editTags").value.toLowerCase();
	var notesField = document.getElementById("editNotes").value;

	punchList[id].subject = subjectField;
	punchList[id].priority = priorityField;
	punchList[id].progress = progressField;
	punchList[id].nDate = nDateField;
	//punchList[id].tags = tagsField;
	punchList[id].notes = notesField;

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
	disableElement("editPunch");
}

function addTag(uuid) {
	/* Before doing this,
			Refresh the array,
			So that we don't overwrite data */

	var item = findArrayId(uuid);
//	var item = document.getElementById("addTag-" + uuid).value;
	var newTag = document.getElementById("addTag-" + uuid).value.toLowerCase();
	var stripLeadingSpace = newTag.replace(', ', ',');
	var noSpaces = stripLeadingSpace.replace(' ', '_');
	var newTags = noSpaces.split(",");

	// make sure tags object exists
	if (punchList[item].tags === undefined) {
		console.log(`Adding tags object to punchList[${item}]`);
		punchList[item].tags = [];
	}

	for ( nt = 0; nt < newTags.length; nt++ ) {
		punchList[item].tags.push(newTags[nt]);
		console.log(`${punchList[item].tags}`);
	}

	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
	editPunch(uuid);
//	disableElement("editPunch");
//	enableElement("punchListAll");
		disableElement("punchListAll");
}

function clearDefault(a){
	if (a.defaultValue === a.value) {
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
