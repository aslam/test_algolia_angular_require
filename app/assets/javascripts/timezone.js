define([

    'moment.timezone'

], function (moment) {

    return function (userTimezone) {

        this.userTimezone = userTimezone;

        this.zone = function () {
            return this.userTimezone ? 'z' : '_z';
        };

        this.init = function () {
            moment.locale('en', {
                longDateFormat : {
                    LT : 'h:mm A ' + this.zone(),
                    L : 'MM/DD/YYYY',
                    LL : 'MMM D YYYY LT',
                    LLL : 'ddd, MMM D YYYY LT',
                    LLLL : 'dddd, MMMM D YYYY LT',
                    llll : 'dddd, MMMM D YYYY h:mm A ' + 'UTC' // This long date format should be used only on formatting UTC time
                }
            });
        };

        this.invalidMomentObject = function (time) {
            return typeof time === 'undeifned' || typeof time._isAMomentObject === 'undefined';
        }

        this.initializeTime = function (time) {
            time = time || new Date().getTime();
            return  this.userTimezone ? moment.tz(time, this.userTimezone) : moment(time);
        };

        this.displayTime = function (parent) {
            parent = parent || $('body');

            var self = this;
            parent.find('.js-format_time').each(function () {
                var element = $(this);
                var time = self.initializeTime(element.data('time'));
                var timeFormat = element.data('time_format');
                switch (timeFormat) {
                    case 'event_poster' :
                        element.html(self.calendar(time));
                        break;
                    default :
                        element.html(time.format(timeFormat));
                        break;
                }
                element.removeClass('.js-format_time');
            });
        };

        this.calendar = function (time) {
            var calendar = {
                sameDay : '[<span class="date today">Today </span><span class="time">] LT [</span>]',
                nextDay : '[<span class="date tomorrow">Tomorrow</span> <span class="time mobile">] LT [</span>]',
                nextWeek : '[<span class="date">]dddd[</span><span class="time mobile">] LT [</span>]',
                sameElse : '[<span class="date">]MMM Do[</span><span class="time mobile">] LT [</span>]'
            };
            var now = this.initializeTime();
            var diff = time.diff(now.startOf('day'), 'days', true);
            var format = diff < 0 ? 'sameElse' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';

            return time.format(calendar[format]);
        };

        this.initializeDateTimePicker = function (container) {
            if (!container || container.length === 0) {
                // You got to be serious!
                return;
            }

            var timeInfo = this.getTimeInfo(container.data('time'));

            container.find('.js-date').val(timeInfo.date);
            container.find('.js-zone').html(timeInfo.zone);
            // Post page using old time select field
            if (container.find('.js-time').length > 0) {
                container.find('.js-time').val(timeInfo.hour + ':' + timeInfo.minute + ' ' + timeInfo.meridian);
            } else {
                container.find('.js-hour').val(timeInfo.hour);
                container.find('.js-minute').val(timeInfo.minute);
                container.find('.js-meridian').val(timeInfo.meridian);
            }
        };

        this.disableDateTimePicker = function (container) {
            if (!container || container.length === 0) {
                return;
            }

            container.find('.js-date, .js-hour, .js-minute, .js-meridian, .js-zone').attr('disabled', 'disabled');
        };

        this.enableDateTimePicker = function (container) {
            if (!container || container.length === 0) {
                return;
            }

            container.find('.js-date, .js-hour, .js-minute, .js-meridian, .js-zone').removeAttr('disabled');
        };

        this.getISOTimeFromDateTimePicker = function (container) {
            var date = container.find('.js-date').val().split('/');

            // In video edit we are not using js-time
            var hour, minute, meridian;
            if (container.find('.js-time').length > 0) {
                var selectedTime = container.find('.js-time').val().split(' ');
                hour = parseInt(selectedTime[0].split(':')[0], 10);
                minute = parseInt(selectedTime[0].split(':')[1], 10);
                meridian = selectedTime[1].toUpperCase();
            } else {
                hour = parseInt(container.find('.js-hour').val(), 10);
                minute = parseInt(container.find('.js-minute').val(), 10);
                meridian = container.find('.js-meridian').val().toUpperCase();
            }

            if (meridian === 'AM' && hour === 12) {
                // hour is 0 for 12 AM
                hour = 0;
            } else if (meridian === 'PM' & hour < 12) {
                hour += 12;
            }

            // Construct a time object in the corresponding timezone for the current date
            var time = this.initializeTime();

            // Set individually month, date, year, hour and minutes to this object
            time.months(parseInt(date[0], 10) - 1);
            time.date(parseInt(date[1], 10));
            time.year(parseInt(date[2], 10));
            time.hours(hour);
            time.minutes(minute);
            time.seconds(0);
            time.milliseconds(0);

            // Return the offset from epoch
            return time.toISOString();
        };

        this.formatAsLongDateTime = function (time) {
            return this.format(time, 'LLL');
        };

        this.formatAsTime = function (time) {
            return this.format(time, 'LT');
        };

        this.formatAsLongDate = function (time) {
            return this.format(time, 'dddd, MMMM DD, YYYY');
        };

        this.formatMailTime = function (time) {
            return this.format(time, 'LLLL');
        };

        this.formatMailTimeinUTC = function (time) {
            return this.initializeTime(time).utc().format('llll');
        };

        this.format = function (time, timeFormat) {
            return this.initializeTime(time).format(timeFormat);
        };

        this.formatAsMonthDate = function (time) {
            return this.format(time, 'MMM DD');
        };

        this.formatAsMonthDateYear = function (time) {
            return this.initializeTime(time).format('MMM D, YYYY');
        };

        this.formatAsMonthDateYearTime = function (time) {
            return this.initializeTime(time).format('MMM D, YYYY h:mma');
        };

        this.formatDate = function (date) {
            var time = this.invalidMomentObject(date) ? this.initializeTime(date) : date;
            return time.format('L')
        }

        this.getTimeInfo = function (date) {
            var time = this.invalidMomentObject(date) ? this.initializeTime(date) : date;
            var zone = time.format(this.zone());

            return {
                date : time.format('L'),
                hour: time.format('hh'),
                minute: time.format('mm'),
                second: time.format('ss'),
                meridian: time.format('A'),
                zone: zone
            };
        }

        this.getTimeZoneOffset = function () {
            return this.initializeTime()._offset;
        }

        this.timeWithoutTimeZone = function () {
            return moment();
        }

        this.subtract = function (period, number) {
            return moment().subtract(number, period);
        }

        this.duration = function (difference) {
            return moment.duration(difference);
        }

        this.getEventFormattedEventTime = function (startTime, endTime) {
            var formattedTime = {
                start : '',
                end : ''
            };
            var sameYear, sameMonth, sameDay, yearFormat;
            var currentYear = this.initializeTime().year();

            if (typeof startTime._isAMomentObject === 'undefined') {
                startTime = this.initializeTime(startTime);
            }

            if (typeof endTime._isAMomentObject === 'undefined') {
                endTime = this.initializeTime(endTime);
            }

            sameYear = (startTime.year() === currentYear)
                && (currentYear === endTime.year());
            sameMonth = startTime.month() === endTime.month();
            sameDay = startTime.day() === endTime.day();
            sameMeridiem = startTime.format('A') === endTime.format('A');

            switch (true) {
                case sameMonth && sameDay && sameMeridiem:
                    yearFormat = sameYear ? '' : ', YYYY';
                    formattedTime.start = startTime.format('ddd, MMM D' +
                        yearFormat + ' [from] h:mm');
                    formattedTime.end = endTime.format('h:mma ' + this.zone());
                    break;
                case sameMonth && sameDay:
                    yearFormat = sameYear ? '' : ', YYYY';
                    formattedTime.start = startTime.format('ddd, MMM D' +
                        yearFormat + ' [from] h:mma');
                    formattedTime.end = endTime.format('h:mma ' + this.zone());
                    break;
                case sameYear:
                    formattedTime.start = startTime.format('ddd, MMM D [at] h:mma');
                    formattedTime.end = endTime.format('ddd, MMM D [at] h:mma ' +
                        this.zone());
                    break;
                default:
                    formattedTime.start = startTime.format('ddd, MMM D, YYYY [at] h:mma');
                    formattedTime.end = endTime.format('ddd, MMM D, YYYY [at] h:mma ' +
                        this.zone());
            }

            return formattedTime;

        };

        this.init();
    };

});
