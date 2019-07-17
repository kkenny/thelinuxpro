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
	console.log("function: initApp()");
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
	console.log("function: writeUserData(" + userId + ", " + name + ", " + email + ", " + imageUrl + ")");
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
	console.log("function: newPunch(" + uid + ", " + subject + ", " + priority + ", " + progress + ", " + needBy + ", " + notes + ", " + tags + ")");
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

function genDaily() {
	console.log("function: genDaily()");

	var daily = [ "Check Workday", "Check Expenses", "Check Change Cases", "Check TD's", "Check at-mentions" ];
	console.log(`${daily[1]}`);
	priority = parseInt("3");

	var d = new Date();
	var needBy = d.setHours(17,0,0);

	var newTag = "work,daily";
	var stripLeadingSpace = newTag.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var newTags = noSpaces.split(",");

	for (x = 0; x < daily.length; x++) {
		newPunch(window.uid, daily[x], priority, "new", needBy, "", newTags);
	}
}

function genWeekly() {
	console.log("function: genWeekly()");

//get next monday:
	// var d = new Date();
	// d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
	// console.log(d)

//	};
	var weekly = [ "Update ORB Notes", "Prep Weekly Meeting", "Build out Broadcast Timer" ];
	var priority = parseInt("5");
	var newTag = "work,weekly";
	var stripLeadingSpace = newTag.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var newTags = noSpaces.split(",");
	var needBy = '';

	for (x = 0; x < weekly.length; x++) {
		newPunch(window.uid, weekly[x], priority, "new", needBy, "", newTags);
	}
}

// Read the punches via listener

// standard functions
function setPriority(sortObject, newPosition) {
	console.log("function: setPriority(" + sortObject + ", " + newPosition + ")");

	var priority = {};

	priority['users/' + window.uid + '/punches/' + sortObject + '/priority' ] = parseInt(newPosition);

	firebase.database().ref().update(priority);

//	loadPunches(window.uid);
}

function startPunch(reference) {
	console.log("function: startPunch(" + reference + ")");

	var start = new Date().getTime();

	// Write the new punch data
	var progress = {};
	var startTime = {};

	progress['users/' + window.uid + '/punches/' + reference + '/progress'] = "in progress";
	startTime['users/' + window.uid + '/punches/' + reference + '/startTime'] = start;

	firebase.database().ref().update(progress);
	firebase.database().ref().update(startTime);

	$( "#" + reference )
		.removeClass( "waiting" )
	$( "#" + reference )
		.removeClass( "punch-default" )
	$( "#" + reference )
		.addClass( "inProgress" );
	$( "#progress" + reference )
		.removeClass( "waiting" )
	$( "#progress" + reference )
		.removeClass( "punch-default" )
	$( "#progress" + reference )
		.addClass( "inProgress" );

	var exists = document.getElementById("timer" + reference);
	if ( exists === null ) {
		console.log("Generate Element: timer" + reference);
		genPunchListItem('<div id="timer' + reference + '" class="three columns punch-default started"></div>', '#details-col-one' + reference);
	}

	var timerExists = exists.innerHTML;
	console.log(timerExists);
	if (timerExists === null || timerExists === '') {
		console.log("createTimer(" + reference + ", " + time + ")");
		var time = new Date(start).getTime();
		createTimer("timer" + reference, time);
	}
}

function completePunch(reference) {
	console.log("function: completePunch(" + reference + ")");
	var end = new Date().getTime();

	// Write the new punch data
	var progress = {};
	var endTime = {};

	progress['users/' + window.uid + '/punches/' + reference + '/progress'] = "done";
	endTime['users/' + window.uid + '/punches/' + reference + '/endTime'] = end;

	firebase.database().ref().update(progress);
	firebase.database().ref().update(endTime);

	deletePunchElement(reference);

//	loadPunches(window.uid);
}

function waitingPunch(reference) {
	console.log("function: waitingPunch(" + reference + ")");
	var progress = {};
	progress['users/' + window.uid + '/punches/' + reference + '/progress'] = "waiting";
	firebase.database().ref().update(progress);

	$( "#" + reference )
		.removeClass( "punch-default" )
	$( "#" + reference )
		.removeClass( "inProgress" )
	$( "#" + reference )
		.addClass( "waiting" );
	$( "#progress" + reference )
		.removeClass( "inProgress" )
	$( "#progress" + reference )
		.removeClass( "punch-default" )
	$( "#progress" + reference )
		.addClass( "waiting" );

//	loadPunches(window.uid);
}

function mkPunchNew(reference) {
	console.log("function: mkPunchNew(" + reference + ")");
	var progress = {};
	progress['users/' + window.uid + '/punches/' + reference + '/progress'] = "new";
	firebase.database().ref().update(progress);

	console.log("setting classes");
	$( "#" + reference )
		.removeClass( "waiting" )
	$( "#" + reference )
		.removeClass( "inProgress" )
	$( "#" + reference )
		.addClass( "punch-default" );
	$( "#progress" + reference )
		.removeClass( "waiting" )
	$( "#progress" + reference )
		.removeClass( "inProgress" )
	$( "#progress" + reference )
		.addClass( "punch-default" );
//	loadPunches(window.uid);
}

function clearDefault(a){
	if (a.defaultValue === a.value) {
		a.value="";
	}
}

function mkSortable(){
	console.log("function: mkSortable()");
	$( function() {
		$( "#sortable" ).sortable({
			cancel: ".portlet-toggle",
			placeholder: "portlet-placeholder ui-corner-all",
			revert: true,
			distance: 50,
			start: function(event, ui) {
				//console.log($( this ).( "li" ));
				console.log(ui.item.context.id);
				console.log(`Start Position: ${ui.item.index()}`);
			},
			stop: function(event, ui) {
//				setPriority(window.sortObjectUUID, ui.item.index());
				console.log(event, ui);
				setPriority(ui.item.context.id, ui.item.index());
				console.log(`New Position: ${ui.item.index()}`);
			}
		});
	});
}

function enableDetail(){
	console.log("function: enableDetail()");
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

function toggleElement(element) {
	document.getElementById(element).classList.toggle("show");
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

// edit punch
function editPunch(uuid) {
	disableElement("punchListAll");
	enableElement("editPunch");

	var punchRef = firebase.database().ref('users/' + uid + '/punches/' + uuid);


	punchRef.once('value').then(function(snapshot) {
		var data = snapshot.val();
		console.log(data);

	var nDate = new Date(data.needByDate);
	var notes = data.notes;
	var priority = data.priority;
	var progress = data.progress;
	var subject = data.subject;
	var tags = data.tags;

	var html = '<div class="container listWrapper">';
	html += '<input type=hidden id="editID" value="' + uuid + '">';
	html += '<div class="edit-row"><div class="three columns">Subject:</div><div class="nine columns"><input class="twelve columns" type=text id="editSubject" value="' + subject + '"></div></div>';
	html += '<div class="three columns">Priority:</div><div class="nine columns"><input type=text id="editPriority" value="' + priority + '"></div>';
	html += '<div class="three columns">Need By:</div><div class="nine columns"><input type=text id="timepickerEdit" value="' + nDate + '"></div>';
	html += '<div class="three columns">Progress:</div><div id="editProgress" class="nine columns">';
	html +=  progress;
	html += '</div>';
	html += '<div class="three columns">Add Tag:</div><div class="nine columns"><input type="text" id="editTags" value="' + tags + '"></div>';
	html += '<div class="three columns">Notes: </div><div class="nine columns"><textarea class="edit-text-box" id="editNotes">' + notes + '</textarea></div>';
	html += '<button onClick=submitEditPunch("' + uuid + '")>Update</button>';
	html += '<button onClick=\'disableElement("editPunch"),enableElement("punchListAll")\'>Close</button>';
	html += '</div>';

	document.getElementById("editPunch").innerHTML = html;
	});

}

function submitEditPunch(uuid) {
	var punchRef = firebase.database().ref('users/' + window.uid + '/punches/' + uuid);

//	var uuid = document.getElementById("editID").value;
	var subjectField = document.getElementById("editSubject").value;
	var priorityField = parseInt(document.getElementById("editPriority").value);
	var progressField = document.getElementById("editProgress").innerHTML;
	var nDateField = document.getElementById("timepickerEdit").value;

	var tagsField = document.getElementById("editTags").value.toLowerCase();
	var stripLeadingSpace = tagsField.replace(/, /g, ',');
	var noSpaces = stripLeadingSpace.replace(/ /g, '_');
	var tagField = noSpaces.split(",");

	var notesField = document.getElementById("editNotes").value;

	var punchData = {
		subject: subjectField,
		priority: priorityField,
		progress: progressField,
		needByDate: nDateField,
		notes: notesField,
		tags: tagField
	};

	var updates = {};
	updates['users/' + uid + '/punches/' + uuid] = punchData;
	firebase.database().ref().update(updates);
	disableElement('editPunch');
	enableElement('punchListAll');
}

function createTimer(element,timeTo) {
	if (timeTo != null && timeTo != undefined && new Date(timeTo).getTime() != 'Invalid Date') {
		var x = setInterval(function() {
			distance = (new Date().getTime() - new Date(timeTo).getTime());
			seconds = Math.floor((distance / 1000) % 60);
			minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			days = Math.floor(distance / (1000 * 60 * 60 * 24));

			if (days < 0)     { days = -(days + 1);
													seconds = (seconds + 1);   }
			if (hours < 0)    { hours = (-(hours) - 1);    }
			if (hours < 10)   { hours = ('0' + hours);     }
			if (minutes < 0)  { minutes = -(minutes);      }
			if (minutes < 10) { minutes = ('0' + minutes); }
			seconds = (seconds -1); //really effing dumb.
			if (seconds < 0)  { seconds = -(seconds);      }
			if (seconds < 10) { seconds = ('0' + seconds); }

			//console.log("Setting Timer on element:" + element);

			var exists = document.getElementById(element);
			if (exists != null) {
				document.getElementById(element).innerHTML = days + "day(s), " + hours + ":" + minutes + ":" + seconds;
			} else {
//				console.log("Could not update: " + element + ", because: " + exists);
			}
		}, 1000);
	}
}

function formatDate(d) {
	d = new Date(d);
	var minutes = d.getMinutes();
	var hours = d.getHours();

	if (minutes < 10) { minutes = ('0' + minutes); }
	if (hours === 0)  { hours = ('0' + hours);     }

	var	s = d.getFullYear() + '/' + d.getMonth() + '/' + d.getDate() + ' ' + hours + ':' + minutes;

	return s;
}


// load punches

function genPunchListItem(elementData, element) {
	$( elementData ).appendTo( element );
}

function updateElementData(element, d) {

	var exists = document.getElementById(element);

	if ( exists != null || exists != undefined ) {
		var e = document.getElementById(element).innerHTML;

		if ( d != e ) {
			console.log("updating: " + element + ", with: " + d + ", was: " + e);
			document.getElementById(element).innerHTML = d;
		} else if ( d === e ) {
			console.log("Not Updating: " + element + ", because: " + d + " === " + e);
		} else {
			console.log("Not updating: " + element + ", because: Something weird happened with: " + d + " & " + e);
		}
	} else {
		console.log("add new element");
	}
}

function updatePunchElement(childKey, childData) {

	updateElementData("priority" + childKey, childData.priority);
	updateElementData("subject" + childKey, childData.subject);
	updateElementData("progress" + childKey, childData.progress);
	updateElementData("neededby-data" + childKey, childData.needByDate);

	//tags

}


function addPunchElement(childKey, childData) {

	if (childData.progress.toLowerCase() === "in progress") { var style = "inProgress"; }
	else if (childData.progress.toLowerCase() === "waiting") { var style = "waiting"; }
	else if (childData.progress.toLowerCase() === "new") { var style = "punch-default"; }
	else { style = "punch-default"; }

	if (childData.progress.toLowerCase() != "done") {
		genPunchListItem('<li id="' + childKey + '" class="' + style + '"></li>', '#sortable');
		genPunchListItem('<div id="div-portlet' + childKey + '" class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>', '#' + childKey);
		genPunchListItem('<div id="priority-container' + childKey + '" class="priority-container"></div>', '#div-portlet' + childKey);
		genPunchListItem('<div id="details-container' + childKey + '" class="container details-container"></div>', '#div-portlet' + childKey);
		genPunchListItem('<div id="priority' + childKey + '" class="twelve columns priority">' + childData.priority + '</div>', '#priority-container' + childKey);
		genPunchListItem('<div id="subject' + childKey + '" class="subject">' + childData.subject + '</div><div id="detail-link' + childKey + '" class="two columns u-pull-right"><a style="margin-left: 10px;" class="punch-default u-pull-right" href="#" onclick=toggleElement(\'backlog-list-content' + childKey + '\')>details</a></div>', '#details-container' + childKey);
		genPunchListItem('<div id="details-col-one' + childKey + '" class="progress-wrapper"></div>', '#details-container' + childKey);
		genPunchListItem('<div id="progress' + childKey +'" class="twelve columns ' + style + '">' + childData.progress + '</div>', '#details-col-one' + childKey);
		genPunchListItem('<div class="twelve columns punch-default" style="color: lime" id="timer' + childKey + '"></div>', '#details-col-one' + childKey);
		// status dropdown
		genPunchListItem('<div id="dropdown-wrapper' + childKey + '" class="dropdown"></div>', '#details-container' + childKey);
		genPunchListItem('<img class="top dropbtn" onclick=progressMenuDrop("' + childKey + '") src="images/down-carrot.png">', '#dropdown-wrapper' + childKey);
		genPunchListItem('<div id="progressDropdown' + childKey + '" class="dropdown-content punch-default"></div>', '#dropdown-wrapper' + childKey);
		genPunchListItem('<a href="#" onClick=mkPunchNew("' + childKey + '")>New</a>', '#progressDropdown' + childKey);
		genPunchListItem('<a href="#" onClick=startPunch("' + childKey + '")>Start</a>', '#progressDropdown' + childKey);
		genPunchListItem('<a href="#" onClick=waitingPunch("' + childKey + '")>Waiting</a>', '#progressDropdown' + childKey);
		genPunchListItem('<a href="#" onClick=completePunch("' + childKey + '")>Finish</a>', '#progressDropdown' + childKey);

		genPunchListItem('<div id="details-col-three' + childKey + '" class="needby-container punch-default"></div>', '#details-container' + childKey);
		genPunchListItem('<div id="details-col-five' + childKey + '" class="five columns punch-default"></div>', '#details-container' + childKey);
		if ( childData.needByDate != null && childData.needByDate != undefined && childData.needByDate != '' ) {
			genPunchListItem('<div id="neededBy' + childKey + '" class="twelve columns punch-default"></div>', '#details-col-three' + childKey);
			genPunchListItem('<div id="needby-data' + childKey + '">' + formatDate(childData.needByDate) + '</div>', '#neededBy' + childKey);
			genPunchListItem('<div id="needby-date-timer' + childKey + '"></div>', '#neededBy' + childKey);
			createTimer('needby-date-timer' + childKey, childData.needByDate);
			genPunchListItem('<div id="countdown-' + childKey + '" class="twelve columns punch-default"></div>', '#details-col-three' + childKey);

			if ( (new Date(childData.needByDate).getTime() - new Date().getTime()) <= 0 ) {
					$( '#needby-data' + childKey ).addClass( "overdue" );
			} else if ( ((new Date(childData.needByDate).getTime() - new Date().getTime()) / 1000) <= 259200 ) {
					$( '#needby-data' + childKey ).addClass( "duesoon" );
			}
		}

		genPunchListItem('<div id="backlog-list-content' + childKey + '" class="backlog-list-content details-container"><div id="punch-list-backlog-details' + childKey + '" class="punch-list-backlog-details"></div></div>', '#div-portlet' + childKey) ;
		if ( childData.startTime != undefined ) {
			genPunchListItem('<div id="startTime" class="three columns punch-default started">' + formatDate(childData.startTime) + '</div>', '#punch-list-backlog-details' + childKey);
			var time = new Date(childData.startTime).getTime();
			createTimer("timer" + childKey, time);
		}
		if ( childData.tags != undefined ) {
			var tags = childData.tags;
			genPunchListItem('<div id="tags-container-summary' + childKey + '" class="twelve columns"></div>', '#details-col-five' + childKey);
			genPunchListItem('<div id="tags-container' + childKey + '" class="twelve columns"></div>', '#punch-list-backlog-details' + childKey);
			genPunchListItem('<div class="two columns tags-details">Tags: </div>', '#tags-container' + childKey);
			genPunchListItem('<div id="tags-column' + childKey + '" class="nine columns tags-details"></div>', '#tags-container' + childKey);
			var i;
			for (i=0; i<tags.length; i++) {
				tagData = tags[i];
				if ((tags.length - 1) === i) { var comma = ' '; }
				else { var comma = ','; }
				genPunchListItem('<a id="tags-summary-' + tagData + childKey + '" class="punch-default tags-summary ' + tagData +'" href="#" onClick=tagFilter("' + tagData + '")>' + tagData + comma + '</a>', '#tags-container-summary' + childKey);
				genPunchListItem('<a id="tags-details-' + tagData + childKey + '" class="tags-details" href="#" onClick=tagFilter("' + tagData + '")>' + tagData + comma + '</a>', '#tags-column' + childKey);
			}
		}
		if ( childData.notes != "" ) {
			genPunchListItem('<textarea class="edit-text-box" readonly>' + childData.notes + '</textarea><br />', '#punch-list-backlog-details' + childKey);
		}
		genPunchListItem('<button class="button" onClick=editPunch("' + childKey + '")>edit</button>', '#punch-list-backlog-details' + childKey);
	}
}

function deletePunchElement(childKey) {
	$('#' + childKey).remove();
}

function clearTagFilter() {
	console.log("clearing tags");

	$( "li" )
		.removeClass( "hide" );
}

function tagFilter(reference) {
	console.log("Filtering Punches on: " + reference);

	$( "li" )
		.addClass( "hide" );

	$( "." + reference )
		.closest( "li" )
		.removeClass( "hide" );
}

function loadPunches(uid) {
	console.log("Loading Punches...");
	//document.getElementById("sortable").innerHTML = '';
	var punchesRef = firebase.database().ref('users/' + uid + '/punches').orderByChild('priority');
	var itemStyle = "punches";
//	list = '<ol id="sortable">';

	punchesRef.on('child_added', function(data) {
		console.log("child Added");
		addPunchElement(data.key, data.val());
	});

	mkSortable();
}

function sortList() {
	console.log('function: sortList()');
	var items = $('li');
	items.sort(function(a, b){
		console.log($(a).data('priority'));
		return +$(a).data('priority') - +$(b).data('priority');
	});

	items.appendTo('#sortable');
}

var looper = setInterval(function() {
	var uid = window.uid;
	var punchesRef = firebase.database().ref('users/' + uid + '/punches').orderByChild('priority');
	punchesRef.on('child_changed', function(data) {
		console.log("Child Changed");
		updatePunchElement(data.key, data.val());
//		deletePunchElement(data.key);
//		addPunchElement(data.key, data.val());
	});

	punchesRef.on('child_removed', function(data) {
		console.log("child Removed");
		deletePunchElement(data.key);
	});
}, 1000);

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
	var priorityField = parseInt(document.getElementById("newPriority").value);
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
//	loadPunches(window.uid);
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

function cleartagfilter() {
	console.log(`clear tags`);
	window.tagfilteritem = undefined;
	getjson();
}

function getStatus(punchList, statusFilter) {
	return punchList.filter(function(punch) { return punch.progress.toLowerCase() != statusFilter; });
}

window.punches = '';



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

	var subject = punchRef.subject;
	var priority = punchRef.priority;
	var progress = punchRef.progress;
	var nDate = punchRef.nDate;
	var notes = punchRef.notes;
	var tags = punchRef.tags;

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

	punchRef.subject = subjectField;
	punchRef.priority = priorityField;
	punchRef.progress = progressField;
	punchRef.nDate = nDateField;
	//punchRef.tags = tagsField;
	punchRef.notes = notesField;

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
	editpunch(uuid);
//	disableelement("editpunch");
//	enableelement("punchlistall");
		disableelement("punchlistall");
}

function cleardefault(a){
	if (a.defaultvalue === a.value) {
		a.value="";
	}
}

function genuid() {
	function chr4() {
		return math.random().tostring(16).slice(-4);
	}
	return chr4() + chr4() +
	'-' + chr4() +
	'-' + chr4() +
	'-' + chr4() +
	'-' + chr4() + chr4() + chr4();
}

//google stuff
function onsignin(googleuser) {
//  var profile = googleuser.getbasicprofile();
//  console.log('id: ' + profile.getid()); // do not send to your backend! use an id token instead.
//  console.log('name: ' + profile.getname());
//  console.log('image url: ' + profile.getimageurl());
//  console.log('email: ' + profile.getemail()); // this is null if the 'email' scope is not present.
//	getjson();
}

function signout() {
  var auth2 = gapi.auth2.getauthinstance();
  auth2.signout().then(function () {
    console.log('user signed out.');
  });
}

$('li').on("click", function(event){
  var target = event.target,
      index = $(target).index();
    console.log(target, index);
    document.getelementbyid("debug1").innerhtml = target + "<br />" + index;
});
*/
