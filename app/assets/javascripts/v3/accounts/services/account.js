// Account Service
'use strict';

define([

    'ng_base/service'

], function (

    ServiceModule

) {

    ServiceModule.service('AccountService', ['$http', '$timeout', '$filter', 'currentUser',
        function ($http, $timeout, $filter, currentUser) {

        var apiUrl  = '/api/accounts/';

        var AccountService  = function (account_id) {
            this.account_id = account_id;
            this.account    = null;
        }

        AccountService.prototype.getAccount = function (isOwnerCallback) {
            // Generally, javascript callbacks, like here the $http.get callback,
            // change the value of the "this" variable inside it
            // so we need to keep a reference to the current instance "this"
            var self = this;

            return $http.get(apiUrl + self.account_id, {
                headers: { 'Authorization': currentUser.authorizationToken() }
            })
                .then(function (response) {
                    var account = response.data;
                    if (isOwnerCallback()) {
                        account.all_events = [].concat(account.draft_events.data, account.private_events.data, account.upcoming_events.data, account.past_events.data);
                    } else {
                        account.all_events = [].concat(account.upcoming_events.data, account.past_events.data);
                    }

                    var dateISO = new Date().toISOString();
                    account.all_events.forEach(function(event, index, array) {
                        switch(true) {
                            case event.in_progress: event.status = 'off_air';
                                break;
                            case (event.broadcast_id > -1): event.status = 'is_live';
                                break;
                            case (event.end_time < dateISO): event.status = 'ended';
                                break;
                            default: event.status = '';
                        }
                    });

                    account.events_count = account.all_events.length;
                    account.events = account.all_events.slice(0, 9); // limit first load to 9 events
                    account.finalEvent_id = account.all_events[account.all_events.length - 1].id;
                    self.account = account;

                    return response;
                });
        }

        AccountService.prototype.getEvents = function(pageNo, perPage) {
            var self = this;

            if (typeof perPage === 'undefined') {
                perPage = 9; // Default per page items
            }

            var start   = pageNo * perPage,
                end     = start + perPage;

            // $timeout returns a promise
            return $timeout(function (){
                return self.account.all_events.slice(start, end);
            }, 0);

        }

        return AccountService;
    }]);

});
