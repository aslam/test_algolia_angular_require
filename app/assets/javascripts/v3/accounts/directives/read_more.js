define([
    
    'ng_base/directive'
    
], function(
    
    DirectiveModule
    
){
    /*
    * Directive to load entire account description and
    * bind it to the specific element in the DOM
    */
    DirectiveModule.directive('readMoreDescription', ['$compile', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {             
                // Method on shared scope, called from the
                // AccountHeaderController
                scope.showMoreDescription = function() {
                    var readLessLink = $compile("<span ng-click='loadLessDescription()'>Read Less</span>")(scope);

                    angular.element(document.querySelector('.js-header_account_description'))
                        .text(scope.account.description)
                        .append(readLessLink);
                };

                scope.showLessDescription = function () {
                    var element = angular.element(document.querySelector('.js-header_account_description'));
                    $compile(element)(scope);
                }
            }   
        };
    }]);
});

