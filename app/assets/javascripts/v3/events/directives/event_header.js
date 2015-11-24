define([

    // Base directive module
    'ng_base/directive',

    // Timezone library
    'user_timezone',

    // templates
    'text!ng_events/templates/event_header.html',

    // required Service
    'ng_events/factories/event_data'

], function (

    DirectiveModule,

    // timezone
    UserTimeZone,

    // Template
    EventHeaderTemplate

) {

    DirectiveModule.directive('eventHeader', ['eventData', function (Event) {
        return {
            restrict : 'E',
            replace : true,
            template : EventHeaderTemplate,
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

                scope.showTime = function () {
                    if (Event.startTime() && Event.endTime()) {
                        var time = UserTimeZone.getInstance()
                            .getEventFormattedEventTime(Event.startTime(), Event.endTime());
                        return time.start + ' - ' + time.end;
                    }
                }
            }
        }

    }]);
});
