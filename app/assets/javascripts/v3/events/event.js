// Bootstrapping the application

define([

    // library
    'angular',

    // controllers
    'ng_events/controllers',

    // directives
    'ng_events/directives',

    // services
    'ng_events/services',

    // factories
    'ng_events/factories',

    // filters
    'ng_events/filters'

], function (

    // library
    angular

) {

    var app = angular.module('events', [
        'app.controllers',
        'app.directives',
        'app.filters',
        'app.factories',
        'app.services',
        'ngCookies',
        'algoliasearch'
    ]);

    return app;

});
