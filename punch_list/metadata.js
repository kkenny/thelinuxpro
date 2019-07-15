var version = "0.10.001",
		debug = false,
		jsonUrl = "https://api.myjson.com/bins/1dodsj",
//		jsonUrl = 'https://punchlist-1561043639952.firebaseio.com/',
		btJsonUrl = "https://api.myjson.com/bins/k0abr",
		showDone = false,
		items,
		item,
		notes,
		cDate,
		array_counter = 0;

var events, list, counter_diff, eventLength, isEventsArray;
var currentObject, nextObject, notes;
var currentDate, nextDate, currentStart, currentEnd;
var nextStart, nextEnd, currentSubject, nextSubject;

var dataLoad = false;
var dataRequested = false;
var initialized = false;
var style = 'green';
var eventStyle = "events";
var array_counter = 0;

