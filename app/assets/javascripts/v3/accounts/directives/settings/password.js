define([

    'ng_base/directive',
    'text!ng_accounts/templates/settings/password.html'

], function (

    DirectiveModule,
    PasswordSettingsTemplate

) {

    DirectiveModule.directive('passwordSettings', function () {
        return {
            restrict: 'E',
            template: PasswordSettingsTemplate,
            link: function (scope, element, attrs) {
            }
        };
    });

});
