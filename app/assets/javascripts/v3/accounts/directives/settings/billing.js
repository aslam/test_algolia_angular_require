define([

    'ng_base/directive',
    'text!ng_accounts/templates/settings/billing.html'

], function (

    DirectiveModule,
    BillingSettingsTemplate

) {

    DirectiveModule.directive('billingSettings', function () {
        return {
            restrict: 'E',
            template: BillingSettingsTemplate,
            link: function (scope, element, attrs) {
            }
        };
    });

});
