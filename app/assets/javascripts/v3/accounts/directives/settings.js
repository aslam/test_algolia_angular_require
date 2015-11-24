define([

    'ng_base/directive',


], function (

    DirectiveModule

) {

    DirectiveModule.directive('settingsMain',
        ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var autoSelectTab = (function () { 
                        var firstMenuItem = angular.element(document.querySelector('.js-menu_item'));
                        firstMenuItem.addClass('selected');
                        firstMenuItem[0].parentElement.classList.add('selected');
                        $timeout(function () {
                            angular.element(firstMenuItem).triggerHandler('click');
                        }, 0);
                    })(); //IIFE

                    var menuItems = angular.element(document.querySelectorAll('.js-menu_item'));

                    // Apply styles for selected link
                    menuItems.on('click', function () {
                        menuItems.removeClass('selected');
                        [].forEach.call(menuItems, function (item, index, arr) {
                            item.parentElement.classList.remove('selected');
                        });
                        angular.element(this).addClass('selected');
                        angular.element(this)[0].parentElement.classList.add('selected');
                    });
                }
            };
        }]
    );

});
