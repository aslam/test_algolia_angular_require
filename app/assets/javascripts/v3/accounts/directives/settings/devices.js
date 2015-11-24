define([

    'ng_base/directive',
    'text!ng_accounts/templates/settings/devices.html'

], function (

    DirectiveModule,
    DeviceSettingsTemplate

) {

    DirectiveModule.directive('deviceSettings', function () {
        return {
            restrict: 'E',
            template: DeviceSettingsTemplate,
            link: function (scope, element, attrs) {
            }
        };
    });

});
