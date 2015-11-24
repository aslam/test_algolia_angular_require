define([

    // library
    'ng_base/directive',
    'text!ng_accounts/templates/sort_events.html'

], function (

    // library
    DirectiveModule,
    SortEventsTemplate

) {

    /*
     */
    DirectiveModule.directive('sortAccountEvents', function () {
        return {
            restrict: 'E',
            template: SortEventsTemplate,
            link: function (scope, element, attrs) {
                var sortOptions = angular.element(document.querySelectorAll('.js-sort_options li')),
                    currentSelection = angular.element(document.querySelector('.js-sort_expression'));

                sortOptions.on('click', function () {
                    var selectedText = angular.element(this).text();
                    sortOptions.removeClass('selected');
                    angular.element(this).addClass('selected');
                    currentSelection.text(selectedText);

                    switch(selectedText.toLowerCase()) {
                        case 'recent':
                            scope.$apply(function () {
                                scope.sortPredicate = 'start_time';
                                scope.reverseSort = true;
                            });
                            break;
                        case 'alphabetical': 
                            scope.$apply(function () {
                                scope.sortPredicate = 'full_name';
                                scope.reverseSort = false;
                            });
                            break;
                    }
                });
            }
        };
    });

});
