var version = "0.14.032"
var debug = false;
var jsonUrl = 'https://api.myjson.com/bins/13hsch';

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
window.stopwatch = 0;
