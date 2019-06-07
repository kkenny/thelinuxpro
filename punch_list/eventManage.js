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
	displayMeta();
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
	document.getElementById("showDone").innerHTML = "Show Done: <a href='#' onClick='toggleShowDone()'>" + showDone + "</a>";

	disableElement("punchDetail");
	enableElement("punchListAll");
	var itemStyle = "punches";
	isItArray(punchList);

//	punchList.sort(function(a, b){return new Date(a.date).getTime() - new Date(b.date).getTime()});
	listLength = punchList.length;

//	list = "<table id=punchListTable class=punches><th class=punches>Punch Item</th><th class=punches>Status</th><th class=punches>Priority</th><th>Action</th>";


//prioritize in-progress
	var list = '';
	for (i = 0; i < listLength; i++) {
		if (punchList[i].progress.toLowerCase() === "in progress") {
			console.log(`in progress`);
//			list += "<tr>";
			list += "<div class='punchlist top-bottom-border'>"; //
			list += "<div class='punchlist container top-bottom-border'>"; //
				list += "<div class='ten columns'>";
					list += "<div class='12 columns " + itemStyle + "' onClick=enablePunchDetail(" + i + ")><span class=subject>" + punchList[i].subject + "</span></div>"; //
					list += "<div class='three columns " + itemStyle + "'>Status: " + punchList[i].progress + "</div>";
					list += "<div class='two columns " + itemStyle + "'>Priority: " + punchList[i].priority + "</div>";
					list += "<div class='four columns " + itemStyle + "'>Need By: " + punchList[i].nDate + "</div>";

					if (punchList[i].tags != undefined) {
						console.log(`Adding tags object to punchList[${item}]`);
						list += "<div class='four columns " + itemStyle + "'>Tags: ";
						for (t = 0; t < punchList[i].tags.length; t++) {
							list += punchList[i].tags[t] + ", ";
						}
						list += "</div>";
					}
				list += "</div>";
				list += "<div class='two columns'>";
					list += "<div class=dropdown>";
						list += "<button class=dropbtn onClick=dropMenu(" + i + ")>Act<i class='fa fa-caret-down'></i></button>";
						list += "<div class=dropdown-content id='myDropdown" + i + "'>";
							list += "<a onClick=startPunch(" + i + ")>start</a>";
							list += "<a onClick=completePunch(" + i + ")>done</a>";
							list += "<a onClick=editPunch(" + i + ")>edit</a>";
							list += "<a onClick=deletePunch(" + i + ")>delete</a>";
						list += "</div>";
					list += "</div>";
				list += "</div>";
				list += "</div>";
			list += "</div>";
			document.getElementById("punchListInProgress").innerHTML = list;
		}
	}

// then !done
	var list = '';
	for (i = 0; i < listLength; i++) {
		if (punchList[i].progress.toLowerCase() != "in progress") {
			if (punchList[i].progress.toLowerCase() != "done") {
				console.log(`not in progress or not done`);
			list += "<div class='punchlist top-bottom-border'>"; //
			list += "<div class='punchlist container top-bottom-border'>"; //
				list += "<div class='ten columns'>";
					list += "<div class='12 columns " + itemStyle + "' onClick=enablePunchDetail(" + i + ")><span class=subject>" + punchList[i].subject + "</span></div>"; //
					list += "<div class='three columns " + itemStyle + "'>Status: " + punchList[i].progress + "</div>";
					list += "<div class='two columns " + itemStyle + "'>Priority: " + punchList[i].priority + "</div>";
					list += "<div class='four columns " + itemStyle + "'>Need By: " + punchList[i].nDate + "</div>";
					if (punchList[i].tags != undefined) {
						console.log(`Adding tags object to punchList[${item}]`);
						list += "<div class='four columns " + itemStyle + "'>Tags: ";
						for (t = 0; t < punchList[i].tags.length; t++) {
							list += punchList[i].tags[t] + ", ";
						}
						list += "</div>";
					}
				list += "</div>";
				list += "<div class='two columns'>";
					list += "<div class=dropdown>";
						list += "<button class=dropbtn onClick=dropMenu(" + i + ")>Act<i class='fa fa-caret-down'></i></button>";
						list += "<div class=dropdown-content id='myDropdown" + i + "'>";
							list += "<a onClick=startPunch(" + i + ")>start</a>";
							list += "<a onClick=completePunch(" + i + ")>done</a>";
							list += "<a onClick=editPunch(" + i + ")>edit</a>";
							list += "<a onClick=deletePunch(" + i + ")>delete</a>";
						list += "</div>";
					list += "</div>";
				list += "</div>";
				list += "</div>";
				list += "</div>";
				document.getElementById("punchListNew").innerHTML = list;
			}
		}
	}

// then done
	var list = '';
	for (i = 0; i < listLength; i++) {
		if (showDone === true) {
			enableElement("punchListDoneWrapper");
			if (punchList[i].progress.toLowerCase() === "done") {
				console.log(`show done.`);
				list += "<div class='punchlist top-bottom-border'>"; //
				list += "<div class='punchlist container top-bottom-border'>"; //
				list += "<div class='ten columns'>";
					list += "<div class='12 columns " + itemStyle + "' onClick=enablePunchDetail(" + i + ")><span class=subject>" + punchList[i].subject + "</span></div>"; //
					list += "<div class='three columns " + itemStyle + "'>Status: " + punchList[i].progress + "</div>";
					list += "<div class='two columns " + itemStyle + "'>Priority: " + punchList[i].priority + "</div>";
					list += "<div class='four columns " + itemStyle + "'>Need By: " + punchList[i].nDate + "</div>";
					if (punchList[i].tags != undefined) {
						console.log(`Adding tags object to punchList[${item}]`);
						list += "<div class='four columns " + itemStyle + "'>Tags: ";
						for (t = 0; t < punchList[i].tags.length; t++) {
							list += punchList[i].tags[t] + ", ";
						}
						list += "</div>";
					}
				list += "</div>";
				list += "<div class='two columns'>";
					list += "<div class=dropdown>";
						list += "<button class=dropbtn onClick=dropMenu(" + i + ")>Act<i class='fa fa-caret-down'></i></button>";
						list += "<div class=dropdown-content id='myDropdown" + i + "'>";
							list += "<a onClick=startPunch(" + i + ")>start</a>";
							list += "<a onClick=completePunch(" + i + ")>done</a>";
							list += "<a onClick=editPunch(" + i + ")>edit</a>";
							list += "<a onClick=deletePunch(" + i + ")>delete</a>";
						list += "</div>";
					list += "</div>";
				list += "</div>";
				list += "</div>";
				list += "</div>";
				document.getElementById("punchListDone").innerHTML = list;
			}
		} else {
			disableElement("punchListDoneWrapper");
		}
	}
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
	disableElement("punchListAll");
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
	enableElement("punchListAll");
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
	getJson(genList);
}

function editPunch(item) {
	disableElement("newEvent");
	disableElement("punchListAll");
	enableElement("editPunch");

	punchList = window.punches;

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
	var item = document.getElementById("editID").value;
	var newTag = document.getElementById("tag").value;

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




