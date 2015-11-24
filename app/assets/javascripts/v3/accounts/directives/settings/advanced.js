define([

    'ng_base/directive',
    'text!ng_accounts/templates/settings/advanced.html'

], function (

    DirectiveModule,
    AdvancedSettingsTemplate

) {

    DirectiveModule.directive('advancedSettings', function () {
        return {
            restrict: 'E',
            template: AdvancedSettingsTemplate,
            link: function (scope, element, attrs) {
            }
        };
    });

});
