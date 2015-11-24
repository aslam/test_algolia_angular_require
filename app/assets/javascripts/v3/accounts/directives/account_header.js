define([

    'ng_base/directive',
    'text!ng_accounts/templates/account_header.html'

], function (

    DirectiveModule,
    AccountHeaderTemplate

) {

    DirectiveModule.directive('accountHeader', function () {
        return {
            restrict: 'E',
            template: AccountHeaderTemplate,
            link: function (scope, element, attrs) {
                // TODO
            }
        };
    });

});



