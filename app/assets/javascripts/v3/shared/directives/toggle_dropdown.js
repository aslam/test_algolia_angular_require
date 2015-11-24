define([

    // library
    'ng_base/directive'

], function (

    // library
    DirectiveModule

) {

    /*
     * directive to toggle a popup when clicked on element 
     */
    DirectiveModule.directive('toggleDropdown', ['$document', function ($document) {
        return {
            restrict: 'A',
            scope : {
                showClass : '@', // this will be added to popup that needs to be shown
                hideClass: '@',  // class to be added while hiding the popup 
                toggleElement: '@', // popup class name
                activeName: '@', // classname to be added to clicked element to show active state
                noHideOnPopupClick: '@', // if passsed as true popup will not hide when clicked inside of popup
                closeClass: '@' // clicking on this will hide the modal
            },
            link: function (scope, element, attrs) {
                scope.hideClass = scope.hideClass || "";
                scope.activeName = scope.activeName || "";

                element.on('click', function (event) {
                    var dropdown = angular.element(document.querySelector(scope.toggleElement));
                    element.hasClass(scope.activeName) ? element.removeClass(scope.activeName) : element.addClass(scope.activeName);
                    if (dropdown.hasClass(scope.showClass)) {
                        dropdown.removeClass(scope.showClass);
                        dropdown.addClass(scope.hideClass);
                    } 
                    else {
                        dropdown.removeClass(scope.hideClass);
                        dropdown.addClass(scope.showClass);
                    }
                    if (dropdown.hasClass(scope.showClass)) {
                        handleClickOustide(element, dropdown, scope, $document);
                    }
                });
            }
        };
    }]);

    var handleClickOustide = function (element, dropdown, scope, $document) {
        var hidePopup = function () {
            element.removeClass(scope.activeName);
            dropdown.removeClass(scope.showClass);
            dropdown.addClass(scope.hideClass);
            $document.off('click', callback);
        }
        var callback = function () {
            if (angular.element(event.target).hasClass(scope.closeClass)) {
                hidePopup();
            }
            if (scope.noHideOnPopupClick && document.querySelector(scope.toggleElement).contains(event.target)) {
                return;
            }
            hidePopup();
        }

        // add delay for document on click as its running on element click itself
        setTimeout(function () {
            $document.on('click', callback);
        }, 100);
    }

});



