define([

    'ng_base/directive'

], function (

    DirectiveModule

) {

    /*
    * Directive to set focus on the search box when the search box becomes visible
    */
    DirectiveModule.directive('focus', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focus, function(value) {
                    if(value === true) { 
                        $timeout(function() {
                            element[0].focus();
                            scope[attrs.focus] = false;
                        });
                    }
                });
            }
        };
    }]);

});

