define([

    'ng_base/directive',
    'text!ng_accounts/templates/event.html'

], function (

    DirectiveModule,
    AccountEventsTemplate

) {

    DirectiveModule.directive('eventCards', function () {
        return {
            restrict: 'E',
            template: AccountEventsTemplate,
            link: function (scope, element, attrs) {
            }
        };
    });

});



