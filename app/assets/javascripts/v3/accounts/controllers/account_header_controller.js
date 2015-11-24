// Controller for the Profile page Header section
'use strict';

define([

    'ng_base/controller'

], function (

    ControllerModule

) {

    ControllerModule.controller('AccountHeaderController', ['$scope', function ($scope) {

        // Method to call directive's method for 
        // binding description text to the element
        $scope.loadMoreDescription = function() {
            $scope.showMoreDescription();
        };

        $scope.loadLessDescription = function () {
            $scope.showLessDescription();
        };

    }]);

});