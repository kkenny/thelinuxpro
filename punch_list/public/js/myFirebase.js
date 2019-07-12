var config = {
  apiKey: "AIzaSyA4De5itV56yaOBfBW6Cnk3fS7skPmDCHM",
  authDomain: "punchlist-1561043639952.firebaseapp.com",
  databaseURL: "https://punchlist-1561043639952.firebaseio.com",
  projectId: "punchlist-1561043639952",
  storageBucket: "",
  messagingSenderId: "999467953896",
  appId: "1:999467953896:web:a4ded59b12ccb9ff"
};

//firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

function initApp() {
  // Auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user){
		console.log(`in onAuthStateChanged`);
    if (user) {
			console.log(`${user.displayName}`);
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
			window.uid = uid;
      var providerData = user.providerData;
			writeUserData(uid, displayName, email, photoURL);
			//newPunch(uid);
			loadPunches(uid);
			document.getElementById('whoami').innerHTML = email;
      // [START_EXCLUDE]
      //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      //document.getElementById('signout').disabled = false;
      //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      // [END_EXCLUDE]
    } else {
      // User is signed out.
      // [START_EXCLUDE]
      //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      //document.getElementById('signout').disabled = true;
      //document.getElementById('quickstart-account-details').textContent = 'null';
        // [END_EXCLUDE]
    }
  });
  // [END authstatelistener]
  //document.getElementById('signout').addEventListener('click', handleSignOut, true);
}


// AUTH //
// [START googlecallback]
function onSignIn(googleUser) {
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      // [START googlecredential]
      var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.getAuthResponse().id_token);
      // [END googlecredential]
      // Sign in with credential from the Google user.
      // [START authwithcred]
      firebase.auth().signInWithCredential(credential).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
        // [END_EXCLUDE]
      });
      // [END authwithcred]
    } else {
			var user = googleUser;
      console.log('User already signed-in Firebase.');
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]
      //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      //document.getElementById('signout').disabled = false;
      //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      // [END_EXCLUDE]
    }
  });
}
// [END googlecallback]
/**
 * Check that the given Google user is equals to the given Firebase user.
 */
// [START checksameuser]
function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}
// [END checksameuser]
/**
 * Handle the sign out button press.
 */
function handleSignOut() {
  var googleAuth = gapi.auth2.getAuthInstance();
  googleAuth.signOut().then(function() {
    firebase.auth().signOut();
  });
}

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).update({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

//var punchesRef = firebase.database().ref('users/' + userId + '/punches');
//punchesRef.on('value', function(snapshot) {
//  updateStarCount(postElement, snapshot.val());
//});

function newPunch(uid, subject, priority, progress, needBy, notes, tags) {

	var punchData = {
		uid: uid,
		subject: subject,
		priority: priority,
		progress: progress,
		needByDate: needBy,
		notes: notes,
		tags: tags
	};

	//Get a key for a new post
	var newPunchKey = firebase.database().ref().child('users/' + window.uid + '/punches').push().key;

	// Write the new punch data
	var updates = {};
	updates['users/' + uid + '/punches/' + newPunchKey] = punchData;

	return firebase.database().ref().update(updates);
}

// Read the punches via listener

// standard functions
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

function startPunch(reference) {

	var start = new Date().getTime();

	// Write the new punch data
	var progress = {};
	var startTime = {};

	progress['users/' + window.uid + '/punches/' + reference + '/progress'] = "in progress";
	startTime['users/' + window.uid + '/punches/' + reference + '/startTime'] = start;

	firebase.database().ref().update(progress);
	firebase.database().ref().update(startTime);

	loadPunches(window.uid);
}

function completePunch(reference) {
	var end = new Date().getTime();

	// Write the new punch data
	var progress = {};
	var endTime = {};

	progress['users/' + window.uid + '/punches/' + reference + '/progress'] = "done";
	endTime['users/' + window.uid + '/punches/' + reference + '/endTime'] = end;

	firebase.database().ref().update(progress);
	firebase.database().ref().update(endTime);

	loadPunches(window.uid);
}

function waitingPunch(reference) {
	var progress = {};
	progress['users/' + window.uid + '/punches/' + reference + '/progress'] = "waiting";
	firebase.database().ref().update(progress);

	loadPunches(window.uid);
}

function mkPunchNew(reference) {
	var progress = {};
	progress['users/' + window.uid + '/punches/' + reference + '/progress'] = "new";
	firebase.database().ref().update(progress);

	loadPunches(window.uid);
}

function clearDefault(a){
	if (a.defaultValue === a.value) {
		a.value="";
	}
}

function mkSortable(){
	$( function() {
		$( "#sortable" ).sortable({
			cancel: ".portlet-toggle",
			placeholder: "portlet-placeholder ui-corner-all",
			revert: true,
			distance: 50,
			start: function(event, ui) {
//				window.sortObjectUUID = punchList[ui.item.index()].uuid;
				console.log(`Start Position: ${ui.item.index()}`);
			},
			stop: function(event, ui) {
//				setPriority(window.sortObjectUUID, ui.item.index());
				console.log(`New Position: ${ui.item.index()}`);
			}
		});
	});

	$(function() {
    $( ".portlet" )
      .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
      .find( ".details-container" )
        .addClass( "ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $( ".portlet-toggle" ).on( "click", function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".backlog-list-content" ).toggle();
    });
		$( "#sortable" ).disableSelection();
	});

// pop-over dialog
	$( "#dialog" ).dialog({ autoOpen: false });
	$( "#opener" ).click(function() {
		$( "#dialog" ).dialog( "open" );
	});
}

// some element functions...
function enableElement(element) {
	console.log(`enabling ${element}`);
	document.getElementById(element).style.display = "block";
}

function disableElement(element) {
	console.log(`disabling ${element}`);
	document.getElementById(element).style.display = "none";
}

// menus
function mainMenuDrop() {
	document.getElementById("mainMenuDropdown").classList.toggle("show");
}

function progressMenuDrop(uuid) {
	document.getElementById("progressDropdown" + uuid).classList.toggle("show");
}

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
// end menus //


// load punches

function genPunchListItem(elementData, element) {
	$( elementData ).appendTo( element );
}

function loadPunches(uid) {

	document.getElementById("sortable").innerHTML = '';
	var punchesRef = firebase.database().ref('users/' + uid + '/punches');
	var itemStyle = "punches";
//	list = '<ol id="sortable">';

	punchesRef.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var childKey = childSnapshot.key;
			var childData = childSnapshot.val();
			console.log("Child Key: " + childKey);

			if (childData.progress.toLowerCase() === "in progress") { var style = "inProgress"; }
			else if (childData.progress.toLowerCase() === "waiting") { var style = "waiting"; }
			else if (childData.progress.toLowerCase() === "new") { var style = "punch-default"; }
			else { style = "punch-default"; }

			if (childData.progress.toLowerCase() != "done") {
				genPunchListItem('<li id="li' + childKey + '" class="' + style + '"></li>', '#sortable');
				genPunchListItem('<div id="div-portlet' + childKey + '" class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>', '#li' + childKey);
				genPunchListItem('<div id="priority-container' + childKey + '" class="container one column"></div>', '#div-portlet' + childKey);
				genPunchListItem('<div id="details-container' + childKey + '" class="container eleven columns details-container"></div>', '#div-portlet' + childKey);
				genPunchListItem('<div id="priority' + childKey + '" class="twelve columns priority">' + childData.priority + '</div>', '#priority-container' + childKey);
				genPunchListItem('<div id="subject' + childKey + '" class="twelve columns subject">' + childData.subject + '</div>', '#details-container' + childKey);
				genPunchListItem('<div id="details-col-one' + childKey + '" class="three columns"></div>', '#details-container' + childKey);
				genPunchListItem('<div id="progress"' + childKey +'" class="twelve columns ' + style + '">' + childData.progress + '</div>', '#details-col-one' + childKey);
				genPunchListItem('<div class="twelve columns punch-default" style="color: lime" id="timer' + childKey + '"></div>', '#details-col-one' + childKey);
				// status dropdown
				genPunchListItem('<div id="dropdown-wrapper' + childKey + '" class="dropdown one column"></div>', '#details-container' + childKey);
				genPunchListItem('<img class="top dropbtn" onclick=progressMenuDrop("' + childKey + '") src="images/down-carrot.png">', '#dropdown-wrapper' + childKey);
				genPunchListItem('<div id="progressDropdown' + childKey + '" class="dropdown-content punch-default"></div>', '#dropdown-wrapper' + childKey);
				genPunchListItem('<a href="#" onClick=mkPunchNew("' + childKey + '")>New</a>', '#progressDropdown' + childKey);
				genPunchListItem('<a href="#" onClick=startPunch("' + childKey + '")>Start</a>', '#progressDropdown' + childKey);
				genPunchListItem('<a href="#" onClick=waitingPunch("' + childKey + '")>Waiting</a>', '#progressDropdown' + childKey);
				genPunchListItem('<a href="#" onClick=completePunch("' + childKey + '")>Finish</a>', '#progressDropdown' + childKey);

				genPunchListItem('<div id="details-col-three' + childKey + '" class="three columns punch-default"></div>', '#details-container' + childKey);
				genPunchListItem('<div id="details-col-four' + childKey + '" class="three columns punch-default"></div>', '#details-container' + childKey);
				genPunchListItem('<div id="details-col-five' + childKey + '" class="three columns punch-default"></div>', '#details-container' + childKey);
				if ( childData.needByDate != null && childData.needByDate != undefined && childData.needByDate != '' ) {
					genPunchListItem('<div id="neededBy' + childKey + '" class="twelve columns punch-default"></div>', '#details-col-three' + childKey);
					genPunchListItem('<div id="needby-data' + childKey + '">' + childData.needByDate + '</div>', '#neededBy' + childKey);
					genPunchListItem('<div id="countdown-' + childKey + '" class="twelve columns punch-default"></div>', '#details-col-three' + childKey);

					if ( (new Date(childData.needByDate).getTime() - new Date().getTime()) <= 0 ) {
						genPunchListItem('<div id="neededBy-status' + childKey + '" class="twelve columns punch-default overdue">OVER DUE</div>', '#details-col-four' + childKey);
					} else if ( ((new Date(childData.needByDate).getTime() - new Date().getTime()) / 1000) <= 259200 ) {
						genPunchListItem('<div id="neededBy-status' + childKey +'" class="twelve columns punch-default duesoon">DUE SOON</div>', '#details-col-four' + childKey);
					} else {
						genPunchListItem('<div id="neededBy-status' + childKey +'" class="twelve columns punch-default">&nbsp;</div>', '#details-col-four' + childKey);
					}
				}

				if ( childData.tags != undefined ) {
					var tags = childData.tags;
					var i;
					for (i=0; i<tags.length; i++) {
						tagData = tags[i];
						genPunchListItem('<a class="punch-default" href="#" onClick=tagFilter("' + tagData + '")>' + tagData + ', </a>', '#details-col-five' + childKey);
					}
				}
				genPunchListItem('<div id="backlog-list-content' + childKey + '" class="backlog-list-content details-container"><div id="punch-list-backlog-details' + childKey + '" class="punch-list-backlog-details"></div></div>', '#div-portlet' + childKey) ;
				if ( childData.startTime != undefined ) {
					genPunchListItem('<div class="three columns punch-default">' + new Date(childData.startTime) + '</div>', '#punch-list-backlog-details' + childKey);
				}
				if ( childData.notes != "" ) {
					genPunchListItem('<textarea class="edit-text-box" readonly>' + childData.notes + '</textarea><br />', '#punch-list-backlog-details' + childKey);
				}
				genPunchListItem('<button class="button" onClick=editPunch("' + childKey + '")>edit</button>', '#punch-list-backlog-details' + childKey);

//				genPunchListItem(list, '#sortable');
			}
		});
	});

mkSortable();
//	genPunchListItem('</ol>';
//	document.getElementById("punchListBacklog").innerHTML = list;

}

// create new punch
function genEventForm() {
	document.getElementById("newSubject").value = "subject";
	document.getElementById("newPriority").value = "priority";
	document.getElementById("timepickerCreate").value = "date";
	document.getElementById("newNotes").value = '';
	document.getElementById("tagsCreate").value = 'tag1,tag2, tag3';

	disableElement('punchListAll');
	enableElement('newEvent');

}

function createNewEvent() {
	disableElement("punchListAll");
	enableElement("newEvent");

	var subjectField = document.getElementById("newSubject").value;
	var priorityField = document.getElementById("newPriority").value;
	var progressField = document.getElementById("newProgress").value;
	var nDateField = document.getElementById("timepickerCreate").value;
	var notesField = document.getElementById("newNotes").value;

	var newTag = document.getElementById("tagsCreate").value.toLowerCase();
	var stripLeadingSpace = newTag.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var newTags = noSpaces.split(",");

	newPunch(window.uid, subjectField, priorityField, progressField, nDateField, notesField, newTags)

	disableElement("newEvent");
	enableElement("punchListAll");
	loadPunches(window.uid);
//	document.getElementById("newEventList").innerHTML = jsonStr;
}

// load everything up!
window.onload = function() {
  initApp();
};

//
//
//
// old script
//
//
//

/*
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

window.punches = '';

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

	var newEventJson = { uuid: genUid(), nDate: nDateField, subject: subjectField, priority: priorityField, progress: progressField, tags: newTags, notes: notesField };
	punchList.push(newEventJson);
	jsonStr = JSON.stringify(punchList);
	putJson(jsonStr);
	disableElement("newEvent");
	enableElement("punchListAll");
//	document.getElementById("newEventList").innerHTML = jsonStr;
}

function genDaily() {
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

$('li').on("click", function(event){
  var target = event.target,
      index = $(target).index();
    console.log(target, index);
    document.getElementById("debug1").innerHTML = target + "<br />" + index;
});
*/
