define([

    // library
    'ng_base/directive',

    //template
    'text!ng_shared/templates/time_picker.html'

], function (

    // library
    DirectiveModule,

    //template
    TimePicker


) {

    DirectiveModule.directive('timePicker', [function () {
        return {
            restrict: 'EA',
            template: TimePicker,
            scope: {
                hours: '=',
                minutes:'=',
                meridian: '='
            },
            replace: true,
            link: function (scope, element, attr) {
                if (!scope.hours) {
                    scope.hours = 00;
                    scope.minutes = 00;
                }

                if (typeof scope.hours === 'string') {
                    scope.hours = parseInt(scope.hours, 10);
                }
                if (typeof scope.minutes === 'string') {
                    scope.minutes = parseInt(scope.minutes, 10);
                }

                if (scope.meridian === 'PM') {
                    scope.hours = scope.hours + 12;
                }

                /* Increases hours by one */
                scope.increaseHours = function () {
                    //Check whether hours have reached max
                    if (scope.hours < 23) {
                        scope.hours = ++scope.hours;
                    } else {
                        scope.hours = 0;
                    }
                };

                /* Decreases hours by one */
                scope.decreaseHours = function () {
                    //Check whether hours have reached min
                    scope.hours = scope.hours <= 0 ? 23 : --scope.hours;
                };

                /* Increases minutes by one */
                scope.increaseMinutes = function () {
                    //Check whether to reset
                    if (scope.minutes >= 59) {
                        scope.minutes = 0;
                    }
                    else {
                        scope.minutes++;
                    }
                };

                /* Decreases minutes by one */
                scope.decreaseMinutes = function () {
                    //Check whether to reset
                    if (scope.minutes <= 0) {
                        scope.minutes = 59;
                    }
                    else {
                        scope.minutes = --scope.minutes;
                    }
                };


                /* Displays hours - what the user sees */
                scope.displayHours = function () {

                    //Create vars
                    var hoursToDisplay = scope.hours;

                    //Check whether to reset etc
                    if (scope.hours > 12) {
                        hoursToDisplay = scope.hours - 12;
                    }

                    //Check for 12 AM etc
                    if (hoursToDisplay == 0) {
                        //Set to am and display 12
                        hoursToDisplay = 12;
                    } else {
                        //Check whether to prepend 0
                        if (hoursToDisplay <= 9) {
                            hoursToDisplay = '0' + hoursToDisplay;
                        }
                    }

                    return hoursToDisplay;
                };

                /* Displays minutes */
                scope.displayMinutes = function () {
                    return scope.minutes <= 9 ? '0' + scope.minutes : scope.minutes;
                };

                /* Switches the current period by ammending hours */
                scope.switchMeridian = function () {
                    scope.hours = scope.hours >= 12 ? scope.hours - 12 : scope.hours + 12;
                };

                element.find('input').on('click', function () {
                    var timeDisplay = element.find('input').next();

                    if (timeDisplay.hasClass('show')) {
                        timeDisplay.removeClass('show');
                    } else {
                        timeDisplay.addClass('show');
                    }
                });
            }
        };
    }]);
});
