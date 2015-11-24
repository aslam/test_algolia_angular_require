define([

    // library
    'ng_base/directive',
    'text!ng_shared/templates/preloader.html'

], function (

    // library
    DirectiveModule,
    Preloader

) {

    DirectiveModule.directive('preloader', [function () {
        return {
            restrict: 'EA',
            template: Preloader,
            replace: true,
            transclude: true
        };
    }]);
});
