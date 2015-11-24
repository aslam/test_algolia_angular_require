(function(window, angular, undefined) {
    'use strict';

angular.module('ngInfiniteScroll', [])

.directive('infiniteScroll', [ "$window", function ($window) {

    return {
        restrict : 'A',
        link : function (scope, element, attrs) {
            var offset = parseInt(attrs.threshold) || 0;
            var lastScrollPosition = 0;

            angular.element($window).on('scroll', function () {
                if (scope.$eval(attrs.canLoad)) {

                    // scrolling down
                    if (this.scrollY >= (window.innerHeight - offset) && this.scrollY > lastScrollPosition) {
                        scope.$apply(attrs.infiniteScroll);
                    }

                    // scrolling reached bottom of the page
                    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                        scope.$apply(attrs.infiniteScroll);
                    }

                    // scrolling up
                    else if (this.scrollY < lastScrollPosition) {
                    }
                }

                lastScrollPosition = this.scrollY;
            });
        }
    };
}]);

})(window, window.angular);
