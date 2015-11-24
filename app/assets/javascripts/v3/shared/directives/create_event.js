define([

    // library
    'ng_base/directive',

    // timezone
    'user_timezone',

    // Template
    'text!ng_shared/templates/create_event.html'

], function (

    DirectiveModule,
    UserTimeZone,
    CreateEventTemplate

) {

    var userTimezone = UserTimeZone.getInstance();

    DirectiveModule.directive('eventCreate', ['currentUser', 'connection', function (currentUser, connection) {
        return {
            replace : true,
            template : CreateEventTemplate,
            controller : ['$scope', function ($scope) {
                // get ISO time
                var getMomentTime = function (dateTimeObject) {
                    var date, time;
                    date = dateTimeObject.date.split('/');
                    // Construct a time object in the corresponding timezone for the current date
                    time = userTimezone.initializeTime();

                    // Set individually month, date, year, hour and minutes to this object
                    time.months(parseInt(date[0], 10) - 1);
                    time.date(parseInt(date[1], 10));
                    time.year(parseInt(date[2], 10));
                    time.hours(dateTimeObject.hour);
                    time.minutes(dateTimeObject.minute);
                    time.seconds(0);
                    time.milliseconds(0);

                    return time.isValid() ? time : undefined;
                }

                var time = userTimezone.initializeTime();
                $scope.startTime = angular.extend(userTimezone.getTimeInfo(time), { time : ''});
                $scope.endTime = angular.extend(userTimezone.getTimeInfo(time.add(1, 'hour')), { time : ''});

                $scope.$watch('startTime.date', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    if (typeof newVal === 'undefined') {
                        $scope.eventForm.start_date.$invalid = true;
                        return;
                    } else {
                        $scope.eventForm.start_date.$invalid = false;
                    }
                });

                $scope.$watch('startTime.time', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                });

                $scope.$watch('endTime.date', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    if (typeof newVal === 'undefined') {
                        $scope.eventForm.end_date.$invalid = true;
                        return;
                    } else {
                        $scope.eventForm.end_date.$invalid = false;
                    }

                    // check if end date is less than start date
                    if (!($scope.eventForm.start_date.$invalid)) {
                        var start = (new Date($scope.startTime.date)).getTime();
                        var end = (new Date($scope.endTime.date)).getTime();
                        if (end < start) {
                            $scope.eventForm.end_date.$dirty = true;
                        } else {
                            $scope.eventForm.end_date.$dirty = false;
                        }
                    }
                });

                $scope.$watch('endTime.time', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                });

                $scope.submit = function (eventForm) {
                    if (eventForm.$valid) {
                        var eventAttributes = {
                            'owner_account_id' : currentUser.id,
                            'is_white_labeled' : false,
                            'full_name' : $scope.full_name
                        };
                        // check for valid start time
                        var start_time = getMomentTime($scope.startTime);
                        if (typeof start_time === 'undefined') {
                            eventForm.start_date.$invalid = true;
                            return;
                        } else {
                            eventForm.start_date.$invalid = false;
                            eventAttributes.start_time = start_time.toISOString();
                        }
                        // check for valid end time
                        var end_time = getMomentTime($scope.endTime);
                        if (typeof end_time === 'undefined') {
                            eventForm.end_date.$invalid = true;
                            return;
                        } else if (end_time.diff(start_time, 'minutes') < 1) {
                            // end time should be more than start time by a minute
                            eventForm.end_date.$dirty = true;
                            return;
                        } else {
                            eventForm.end_date.$invalid = false;
                            eventForm.end_date.$dirty = false;
                            eventAttributes.end_time = end_time.toISOString()
                        }
                        connection.post({
                            url : '/accounts/' + currentUser.id + '/events',
                            authorize : true,
                            api : true,
                            data : eventAttributes,
                            onSuccess : function (response, status) {
                                window.location.href = '/__breeze__/accounts/' + currentUser.id + '/events/' + response.id;
                            },
                            onError : function (response, status) {
                                console.log(response, status)
                            }
                        })
                    }
                }
            }],
            link : function (scope) {
            }
        }
    }])
})
