define([

    'ng_base/directive',
    'text!ng_accounts/templates/search_events.html'

], function (

    DirectiveModule,
    SearchEventsTemplate

) {

    /*
    * Directive to handle all events associated with the search icon 
    * and search box in the account events section
    */
    DirectiveModule.directive('searchAccountEvents', function () {
        return {
            restrict: 'E',
            template: SearchEventsTemplate,
            link: function (scope, element, attrs) {

                var searchArea  = angular.element(document.querySelector('.js-account_events_search_area')),
                    searchBox   = angular.element(document.querySelector('.js-search_box')),
                    searchIcon  = angular.element(document.querySelector('.js-account_content_search_label')),
                    searchClear = angular.element(document.querySelector('.js-account_search_delete_icon'));

                var clearSearchBox = function () {
                    searchBox.val('');
                    searchClear.removeClass('show').addClass('hide');
                    searchBox.removeClass('show').addClass('hide');
                    searchIcon.removeClass('prepend-left');
                };

                var searchScope = ['js-search_box', 'js-account_events_search_area'],
                    targetClass;
                searchArea.on('focusout', function () {
                    if (searchBox.val().length === 0) {
                        if (event.relatedTarget !== null) {
                            targetClass = event.relatedTarget.attributes["class"].value;

                            if (searchScope.some(function (s) { return targetClass.indexOf(s) > -1; })){
                                return;
                            } else {
                                clearSearchBox();
                            }
                        } else {
                            clearSearchBox()
                        }
                    }   
                });
                searchIcon.on('click', function () {
                    searchBox.removeClass('hide').addClass('show');
                    searchIcon.addClass('prepend-left');
                });
                searchBox.on('keypress', function () {
                    searchClear.removeClass('hide').addClass('show');
                });
                searchClear.on('click', function () {
                    searchBox.val('');
                    scope.$apply(scope.searchParam = '');
                    angular.element(this).removeClass('show').addClass('hide');
                });

            }
        };
    });

});

