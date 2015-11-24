define([

    'ng_base/directive',
    'text!ng_accounts/templates/settings/menu.html'

], function (

    DirectiveModule,
    SettingsMenuTemplate

) {

    DirectiveModule.directive('settingsMenu', function () {
        return {
            restrict: 'E',
            template: SettingsMenuTemplate,
            link: function (scope, element, attrs) {
            }
        };
    });

});
