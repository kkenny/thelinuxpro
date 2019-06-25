// Create start date
var start = new Date(),
    prevDay,
    startHours = 9;

		timeFormat = 'hh:mm:ss',
// 09:00 AM
start.setHours(9);
start.setMinutes(0);

// If today is Saturday or Sunday set 10:00 AM
if ([6, 0].indexOf(start.getDay()) != -1) {
    start.setHours(10);
    startHours = 10;
}

$('#timepickerCreate').datepicker({
    timepicker: true,
    language: 'en',
    startDate: start,
    minHours: 0,
    maxHours: 23,
    onSelect: function (fd, d, picker) {
        // Do nothing if selection was cleared
        if (!d) return;

        var day = d.getDay();

        // Trigger only if date is changed
        if (prevDay != undefined && prevDay == day) return;
        prevDay = day;

        // If chosen day is Saturday or Sunday when set
        // hour value for weekends, else restore defaults
        if (day == 6 || day == 0) {
            picker.update({
//                minHours: 10,
//                maxHours: 16
            })
        } else {
            picker.update({
 //               minHours: 9,
//                maxHours: 18
            })
        }
    }
})

$('#timepickerEdit').datepicker({
    timepicker: true,
    language: 'en',
    startDate: start,
    minHours: 0,
    maxHours: 23,
    onSelect: function (fd, d, picker) {
        // Do nothing if selection was cleared
        if (!d) return;

        var day = d.getDay();

        // Trigger only if date is changed
        if (prevDay != undefined && prevDay == day) return;
        prevDay = day;

        // If chosen day is Saturday or Sunday when set
        // hour value for weekends, else restore defaults
        if (day == 6 || day == 0) {
            picker.update({
//                minHours: 10,
//                maxHours: 16
            })
        } else {
            picker.update({
 //               minHours: 9,
//                maxHours: 18
            })
        }
    }
})
