// Main Controller for the Profile Page
'use strict';

define([

    'ng_base/controller',

], function (

    ControllerModule

) {


    ControllerModule.controller('AccountController',
        ['$scope', '$location', '$timeout', 'AccountService', 'currentUser',
            function ($scope, $location, $timeout, AccountService, currentUser) {

                // Parsing location.href to figure out account_id
                var path  = $location.path();
                var parts = path.split('/');
                var account_id = $.grep(parts, function (e) { return e; } )[0];
                var currentPage = 0;

                $scope.account_id = account_id;

                var accountService = new AccountService(account_id);

                // Default: Sort the events chronologically
                $scope.sortPredicate    = 'start_time';
                $scope.reverseSort      = true;
                $scope.strictSearch     = false;
                $scope.allowEventsLoad  = false;
                $scope.showEventLoader  = false;
                var isOwnerCheck     = function () {
                    return (currentUser.isLoggedIn() && currentUser.id === parseInt(account_id));
                };
                $scope.isOwner          = isOwnerCheck();

                accountService.getAccount(isOwnerCheck).then(function (account) {
                    $scope.account = accountService.account;
                }, function (error) {
                    console.log('Fetch unsuccessful: ' + JSON.stringify(error));
                });

                // Auto select the profile tab when controller loads
                var initializeTabs = (function () {
                    if($scope.isOwner) {
                        $timeout(function () {
                            angular.element(document.querySelector('.js-tab')).triggerHandler('click');
                        }, 0);
                    }
                })(); // IIFE

                $scope.loadMoreEvents = function () {
                    $scope.showEventLoader = true; // Show spinner
                    accountService.getEvents(currentPage + 1)
                        .then(function (newEvents) {
                            if (typeof newEvents !== 'undefined') {
                                if (newEvents.length === 0) {
                                    $scope.allowEventsLoad = false; // no more events to load
                                } else {
                                    var prevEvents = $scope.account.events;
                                    $scope.account.events = prevEvents.concat(newEvents);
                                    currentPage += 1;
                                }
                            }

                            $scope.showEventLoader = false; // Hide spinner
                        }, function (error) {
                            console.log('Fetch more events unsuccessful: ' + JSON.stringify(error));
                        });
                }

                $scope.activateInfiniteScroll = function ($event) {
                    angular.element($event.currentTarget).addClass('hide');
                    $scope.allowEventsLoad = true;
                    $scope.loadMoreEvents();
                }
            }
        ]

    );

});
