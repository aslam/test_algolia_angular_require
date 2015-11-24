define([

    // library
    'ng_base/directive',
    'text!ng_accounts/templates/owner_tabs.html'

], function (

    // library
    DirectiveModule,
    AccountTabsTemplate

) {

    /*
     */
    DirectiveModule.directive('ownerTabs', function () {
        return {
            restrict: 'AE',
            template: AccountTabsTemplate,
            link: function (scope, element, attrs) {
                var tabs = angular.element(document.querySelectorAll('.js-tab'));

                tabs.on('click', function () {
                    tabs.removeClass('selected_tab');
                    angular.element(this).addClass('selected_tab');
                });
            }
        };
    });

});
