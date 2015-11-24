define([

    // Base filter module
    'ng_base/filter',

    'user_timezone'

], function (

    FilterModule,

    UserTimeZone

) {

    var userTimeZone = UserTimeZone.getInstance();

    FilterModule.filter('formatDatetime', function () {
        var formats = {
            start: function (time) {
                var now = userTimeZone.initializeTime();
                var timeWithZone = userTimeZone.initializeTime(time);
                var dayCount = timeWithZone.diff(now, 'days');
                var text;
                switch (dayCount) {
                    case (dayCount === 0) :
                        text = timeWithZone.format('[Today at] hh:mm A');
                        break;
                    case (dayCount === 1) :
                        text = timeWithZone.format('[Tomorrow at] hh:mm A');
                        break;
                    case (dayCount < 7) :
                        text = timeWithZone.format('dddd [at] hh:mm A');
                        break;
                    default :
                        if (timeWithZone.year() === now.year()) {
                            text = timeWithZone.format('MMM Do [at] hh:mm A');
                        } else {
                            text = timeWithZone.format('MMM Do, YYYY [at] hh:mm A');
                        }
                }

                return text;
            },
            end: function (time) {
                var now = userTimeZone.initializeTime();
                var timeWithZone = userTimeZone.initializeTime(time);
                var hourCount = now.diff(timeWithZone, 'hours');
                var text, minute;
                if (hourCount < 1) {
                    minute = now.diff(timeWithZone, 'minute');
                    text = minute <= 1 ? '1 min ' : (minute + ' mins ') + 'ago';
                } else if (hourCount <= 12) {
                    text = hourCount + ' hour' + (hourCount === 1 ? ' ' : 's ') + 'ago';
                } else if (timeWithZone.year() === now.year()) {
                    text = timeWithZone.format('MMM Do [at] hh:mm A');
                } else {
                    text = timeWithZone.format('MMM Do, YYYY');
                }

                return text;
            }
        };

        return function (datetime, format) {
            if (format === undefined || format === '') {
                format = 'start'
            }

            return formats[format](datetime);
        }
    })

})
