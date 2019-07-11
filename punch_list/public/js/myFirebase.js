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
function clearDefault(a){
	if (a.defaultValue === a.value) {
		a.value="";
	}
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

// menu
function mainMenuDrop() {
	document.getElementById("mainMenuDropdown").classList.toggle("show");
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

// load punches

function genPunchListItem(elementData, element) {
	$( elementData ).appendTo( element );
}

function loadPunches(uid) {
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
			else { style = "punch-default" }

			var list = '';
			if (childData.progress.toLowerCase() != "done") {
				genPunchListItem('<li id="li' + childKey + '" class="' + style + '"></li>', '#sortable');
				genPunchListItem('<div id="div-portlet' + childKey +'" class="portlet"></div>', '#li' + childKey);
				genPunchListItem('<div id="div-backlog-list-header' + childKey +'" class="backlog-list-header"></div>', '#div-portlet' + childKey);
				genPunchListItem('<div class="one column">' + childData.priority + '</div>', '#div-backlog-list-header' + childKey);
				genPunchListItem('<div class="ten columns subject">' + childData.subject + '</div>', '#div-backlog-list-header' + childKey);
				genPunchListItem('<div class="three columns"><div class="twelve columns ' + style + '">' + childData.progress + '</div><div class="twelve columns punch-default" style="color: lime" id="timer-' + childKey + '"></div></div>', '#div-backlog-list-header' + childKey);
				// status dropdown
				genPunchListItem('<div id="dropdown-wrapper' + childKey + '" class="dropdown one column"></div>', '#div-backlog-list-header' + childKey);
				genPunchListItem('<img class="top dropbtn" onclick=progressMenuDrop("' + childKey + '") src="images/down-carrot.png">', '#dropdown-wrapper' + childKey);
				genPunchListItem('<div id="progressDropdown-' + childKey + '" class="dropdown-content punch-default"></div>', '#dropdown-wrapper' + childKey);
				genPunchListItem('<a href="#" onClick=mkPunchNew("' + childKey + '")>New</a>', '#progressDropdown-' + childKey);
				genPunchListItem('<a href="#" onClick=startPunch("' + childKey + '")>Start</a>', '#progressDropdown-' + childKey);
				genPunchListItem('<a href="#" onClick=waitingPunch("' + childKey + '")>Waiting</a>', '#progressDropdown-' + childKey);
				genPunchListItem('<a href="#" onClick=completePunch("' + childKey + '")>Finish</a>', '#progressDropdown-' + childKey);

				if ( childData.needByDate != null && childData.needByDate != undefined && childData.needByDate != '' ) {
				genPunchListItem('<div id="div-needby-wrapper' + childKey + '" class="three columns punch-default"></div>', '#div-backlog-list-header' + childKey);
				genPunchListItem('<div id="neededBy' + childKey + '" class="twelve columns punch-default"></div>', '#div-needby-wrapper' + childKey);
				genPunchListItem('<div>' + childData.needByDate + '</div>', '#neededBy' + childKey);
				genPunchListItem('<div id="countdown-' + childKey + '" class="twelve columns punch-default"></div>', '#div-needby-wrapper' + childKey);
				} else {
					genPunchListItem('<div class="three columns punch-default">&nbsp;</div>', '#div-backlog-list-header' + childKey);
				}
				if ( (new Date(childData.needByDate).getTime() - new Date().getTime()) <= 0 ) {
					genPunchListItem('<div id="neededBy-status' + childKey + '" class="two columns punch-default overdue">OVER DUE</div>', '#div-backlog-list-header' + childKey);
				} else if ( ((new Date(childData.needByDate).getTime() - new Date().getTime()) / 1000) <= 259200 ) {
					genPunchListItem('<div id="neededBy-status' + childKey +'" class="two columns punch-default duesoon">DUE SOON</div>', '#div-backlog-list-header' + childKey);
				} else {
					genPunchListItem('<div id="neededBy-status' + childKey +'" class="two columns punch-default">&nbsp;</div>', '#div-backlog-list-header' + childKey);
				}

				if ( childData.tags != undefined ) {
					var tags = childData.tags;
					console.log("tags" + tags);
					genPunchListItem('<div id="tags-wrapper' + childKey + '" class="four columns punch-default"></div>', '#div-backlog-list-header' + childKey);
					var i;
					for (i=0; i<tags.length; i++) {
						tagData = tags[i];
						genPunchListItem('<a class="punch-default" href="#" onClick=tagFilter("' + tagData + '")>' + tagData + '</a>', '#tags-wrapper' + childKey);
						if ( (i + 1) < tags.length ) {
							genPunchListItem("<span>, </span>", '#tags-wrapper' + childKey);;
						}
					}
				}
				//genPunchListItem('<div class="backlog-list-content"><div style="punch-list-backlog-details">';
				//if ( childData.startTime != undefined ) {
				//	genPunchListItem('<div class="three columns punch-default">';
				//	genPunchListItem(new Date(childData.startTime);
				//	genPunchListItem('</div>';
				//}
				//if ( childData.notes != "" ) {
				//	genPunchListItem('<textarea class="edit-text-box" readonly>' + childData.notes + '</textarea><br />';
				//}
				//genPunchListItem('<button class="button" onClick=editPunch("' + childKey + '")>edit</button>';
				//genPunchListItem('</div></div></div></div></li>';

//				genPunchListItem(list, '#sortable');
			}
		})
	});

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
//	document.getElementById("newEventList").innerHTML = jsonStr;
}

// load everything up!
window.onload = function() {
  initApp();
};

function append() {
	$( "<p>Hello There!</p>" ).appendTo( ".punchListBacklog" );
}

// old script

