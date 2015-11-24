define([

    // library
    'ng_base/directive',
    //template
    'text!ng_shared/templates/custom_select.html'

], function (

    // library
    DirectiveModule,

    //template
    customSelect

) {

    DirectiveModule.directive('customSelect',['$document', '$timeout', function ($document, $timeout) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            template: customSelect,
            scope : {
                options: '=',
                clickable: '@',
                dropdownClass: '@',
                uniqueClass: '@' // for applying styles based on this class
            },
            link: function (scope, element, attrs) {
                var selectedField;
                $timeout(function () { // required to execute the code after template is ready
                    selectedField = angular.element(document.querySelector('.'+scope.clickable));
                    selectedField.on('click', function () {
                        scope.showOptions = !scope.showOptions;
                        scope.$apply();
                        if (scope.showOptions) {
                            scope.handleEvents();
                        }
                    });
                }, 0,false);

                if (!scope.selectedIndex) {
                    scope.selectedIndex = 0;
                }
                scope.moveDown = function () {
                    scope.selectedIndex = (scope.selectedIndex == scope.options.length-1) ? (scope.options.length-1) : (scope.selectedIndex+1);
                    scope.updateSelectedItem(scope.selectedIndex)
                    scope.$apply();
                };

                scope.moveUp = function () {
                    scope.selectedIndex = (scope.selectedIndex == 0) ? 0 : (scope.selectedIndex-1);
                    scope.updateSelectedItem(scope.selectedIndex)
                    scope.$apply();
                };

                scope.updateSelectedItem = function (selectedItem) {
                    scope.selectedVal = scope.options[selectedItem].option;
                    if (scope.options[selectedItem].imgClass) {
                        scope.selectedIcon = scope.options[selectedItem].imgClass;
                    }
                    if (scope.options[selectedItem].description) {
                        scope.selectedDescription = scope.options[selectedItem].description;
                    }
                };

                scope.handleEvents = function () {
                    var callback = function (event) {
                        if (event.type == 'click') {
                            if (document.querySelector('.'+scope.dropdownClass).contains(event.target)) {
                                scope.selectedIndex = parseInt(event.target.getAttribute('data-index'));
                                scope.updateSelectedItem(scope.selectedIndex)
                                hideDropdown();
                            }
                            else {
                                hideDropdown();
                            }
                        }
                        if (event.type == "keydown") {
                           switch (event.keyCode) {
                                case 13:
                                    hideDropdown();
                                    break;
                                case 38:
                                    scope.moveUp();
                                    break;
                                case 40:
                                    scope.moveDown();
                                    break;
                            }
                        }
                    };

                    var hideDropdown = function () {
                        scope.showOptions = false;
                        scope.$apply();
                        $document.off('click keydown', callback);
                    };

                    setTimeout(function () {
                        $document.on('click keydown', callback);
                    }, 100);
                };

            }
        }
    }]);
});
