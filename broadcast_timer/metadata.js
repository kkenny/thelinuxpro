var version = "0.12.311"
var debug = false;
var jsonUrl = "https://api.myjson.com/bins/k0abr";

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

