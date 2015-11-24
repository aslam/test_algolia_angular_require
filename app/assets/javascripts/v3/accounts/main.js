require([

    // libraries
    'angular',
    'jquery',

    // main module
    'ng_accounts/application',

    // plugins
    'angular.cookies',
    'angular.routes',
    'angular.ellipsis',
    'angular.infiniteScroll',
    'angular.uiRouter',
    'angular.algoliaSearch'

], function (

    angular,
    $

){

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['accounts']);
    });

});
