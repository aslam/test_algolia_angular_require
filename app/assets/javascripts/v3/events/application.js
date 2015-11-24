require([

    // library
    'angular',

    // main module
    'ng_events/event',

    // plugins
    'angular.cookies',
    'angular.algoliaSearch'

], function (

    angular

){

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['events']);
    });

});
