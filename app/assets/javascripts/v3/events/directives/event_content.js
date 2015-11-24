define([

    // Base directive module
    'ng_base/directive',

    // Timezone library
    'user_timezone',

    // templates
    'text!ng_events/templates/event_content.html',

    // required Service
    'ng_events/factories/event_data'

], function (

    DirectiveModule,

    // timezone
    UserTimeZone,

    // Template
    EventContentTemplate

) {

    var userTimeZone = UserTimeZone.getInstance();

    DirectiveModule.directive('eventContent', ['eventData', '$interval', function (Event, $interval) {
        return {
            restrict : 'E',
            replace : true,
            template : EventContentTemplate,
            controller : ['$scope', function ($scope) {
                $scope.eventData = Event;
            }],
            link : function (scope, element, attrs) {
                scope.$watch(
                    function () {
                        return Event.is_live;
                    },
                    function () {
                        scope.event_status = Event.status();
                    },
                    true
                );

                scope.startCoundown = function () {
                    var difference = Event.startTime().diff(userTimeZone.initializeTime(), '');
                    var intervalId, hour, minutes, seconds;
                    intervalId = $interval(function () {
                        difference = difference - 1000;
                        hour = String(Math.floor(difference / 3600000));
                        minutes = String(Math.floor(((difference / (60000)) % 60)));
                        seconds = String(Math.floor((difference / 1000) % 60));
                        scope.hour = hour.length === 1 ? '0' + hour : hour;
                        scope.minutes = minutes.length === 1 ? '0' + minutes : minutes;
                        scope.seconds = seconds.length === 1 ? '0' + seconds : seconds;

                        if (difference < 0) {
                            scope.event_status = Event.status();
                            $interval.cancel(intervalId);
                        }
                    }, 1000);
                };

                scope.getFormattedStartTime = function () {
                    var startTime = Event.startTime();
                    var now = userTimeZone.initializeTime();
                    var dayCount = startTime.diff(now, 'days');
                    var text;
                    switch (true) {
                        case (dayCount === 0) :
                            text = startTime.format('[Today at] hh:mm A');
                            break;
                        case (dayCount === 1) :
                            text = startTime.format('[Tomorrow at] hh:mm A');
                            break;
                        case (dayCount < 7) :
                            text = startTime.format('dddd [at] hh:mm A');
                            break;
                        default :
                            if (startTime.year() === now.year()) {
                                text = startTime.format('MMM Do [at] hh:mm A');
                            } else {
                                text = startTime.format('MMM Do, YYYY [at] hh:mm A');
                            }
                    }
                    return text;

                };

                scope.getFormattedEndTime = function () {
                    var endTime = Event.endTime();
                    var now = userTimeZone.initializeTime();
                    var hourCount = now.diff(endTime, 'hours');
                    var text, minute;
                    if (hourCount < 1) {
                        minute = now.diff(endTime, 'minute');
                        text = minute <= 1 ? '1 min ' : (minute + ' mins ') + 'ago';
                    } else if (hourCount <= 12) {
                        text = hourCount + ' hour' + (hourCount === 1 ? ' ' : 's ') + 'ago';
                    } else if (endTime.year() === now.year()) {
                        text = endTime.format('MMM Do [at] hh:mm A');
                    } else {
                        text = endTime.format('MMM Do, YYYY');
                    }
                    return text;
                }

            }
        }
    }]);

})
