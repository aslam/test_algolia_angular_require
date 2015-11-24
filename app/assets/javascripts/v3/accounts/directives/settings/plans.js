define([

    'ng_base/directive',
    'text!ng_accounts/templates/settings/plans.html'

], function (

    DirectiveModule,
    PlanSettingsTemplate

) {

    DirectiveModule.directive('planSettings', function () {
        return {
            restrict: 'E',
            template: PlanSettingsTemplate,
            link: function (scope, element, attrs) {
            }
        };
    });

});
