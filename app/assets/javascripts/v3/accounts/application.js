// Bootstrapping the application

define([

    'angular',

    'text!ng_accounts/templates/profile.html',

    'text!ng_accounts/templates/settings.html',

    'text!ng_accounts/templates/settings/account.html',

    'text!ng_accounts/templates/settings/password.html',

    'text!ng_accounts/templates/settings/plans.html',

    'text!ng_accounts/templates/settings/notifications.html',

    'text!ng_accounts/templates/settings/billing.html',

    'text!ng_accounts/templates/settings/devices.html',

    'text!ng_accounts/templates/settings/advanced.html',

    'ng_accounts/controllers',

    'ng_accounts/directives',

    'ng_accounts/services',

    'ng_accounts/filters',

    'ng_accounts/factories'

], function (

    angular,

    ProfileTemplate,

    SettingsTemplate,

    AccountSettingsTemplate,

    PasswordSettingsTemplate,

    PlanSettingsTemplate,

    NotificationSettingsTemplate,

    BillingSettingsTemplate,

    DeviceSettingsTemplate,

    AdvancedSettingsTemplate

) {

    var app = angular.module('accounts', [
        'app.controllers',
        'app.services',
        'app.directives',
        'app.filters',
        'app.factories',
        'ngCookies',
        'ngRoute',
        'ngEllipsis',
        'ngInfiniteScroll',
        'ui.router',
        'algoliasearch'
    ]);

    return app.config(['$routeProvider', '$locationProvider', '$stateProvider',
        function($routeProvider, $locationProvider, $stateProvider) {
            $stateProvider
                .state('profile', {
                    url: '/:account_id/profile',
                    template: ProfileTemplate
                })
                .state('analytics', {
                    url: '/:account_id/analytics',
                    template: '<h2>Welcome to analytics!</h2>'
                })
                .state('settings', {
                    url: '/:account_id/settings',
                    template: SettingsTemplate
                })
                .state('settings.account', {
                    url: '/account',
                    template: AccountSettingsTemplate
                })
                .state('settings.password', {
                    url: '/password',
                    template: PasswordSettingsTemplate
                })
                .state('settings.notifications', {
                    url: '/notifications',
                    template: NotificationSettingsTemplate
                })
                .state('settings.plans', {
                    url: '/plans',
                    template: PlanSettingsTemplate
                })
                .state('settings.billing', {
                    url: '/billing',
                    template: BillingSettingsTemplate
                })
                .state('settings.devices', {
                    url: '/devices',
                    template: DeviceSettingsTemplate
                })
                .state('settings.advanced', {
                    url: '/advanced',
                    template: AdvancedSettingsTemplate
                })
                .state('live_video_tools', {
                    url: '/:account_id/live_video_tools',
                    template: '<h2>Welcome to Live Video Tools!</h2>'
                })
                .state('default', {
                    url: '/:account_id',
                    template: ProfileTemplate
                });

            $locationProvider.html5Mode(true).hashPrefix('!');
        }]
    );

});
