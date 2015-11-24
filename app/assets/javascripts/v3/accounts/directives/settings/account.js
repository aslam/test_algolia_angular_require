define([

    'ng_base/directive',
    'text!ng_accounts/templates/settings/account.html'

], function (

    DirectiveModule,
    AccountSettingsTemplate

) {

    DirectiveModule.directive('accountSettings', function () {
        return {
            restrict: 'E',
            template: AccountSettingsTemplate,
            link: function (scope, element, attrs) {
            }
        };
    });

});
