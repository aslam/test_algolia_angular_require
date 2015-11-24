define([

    // Base controller module
    'ng_base/controller'

], function (

    ControllerModule

) {

    ControllerModule.controller('eventController', ['$scope', 'eventData', function ($scope, eventData) {

        $scope.is_owner = eventData.isOwner();

    }]);

});
