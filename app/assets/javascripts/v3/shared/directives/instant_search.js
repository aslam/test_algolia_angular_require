define([

    // base directive module
    'ng_base/directive',

    // templates
    'text!ng_shared/templates/search_field.html',

    // dependent factory
    'ng_shared/factories/instant_search'

], function (

    DirectiveModule,

    InstantSearchTemplate

) {


    DirectiveModule.directive('instantSearch', ['instantSearchFactory', function (instantSearchFactory) {

        return {
            restrict : 'E',
            replace : true,
            template : InstantSearchTemplate,
            scope : {
                items : '=',
            },
            controller : ['$scope', function ($scope) {

                // temporary config, index list should be populated from server side
                var indexes = ['accounts-blr', 'events-blr', 'videos-blr'];

                $scope.items = [];
                $scope.hide = false;
                $scope.result = {
                    accounts : [],
                    events : [],
                    videos : []
                }

                this.activate = function (item) {
                    $scope.active = item;
                },

                this.activateNextItem = function() {
                    var index = $scope.items.indexOf($scope.active);
                    this.activate($scope.items[(index + 1) % $scope.items.length]);
                };

                this.activatePreviousItem = function() {
                    var index = $scope.items.indexOf($scope.active);
                    this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
                };

                this.isActive = function(item) {
                    return $scope.active === item;
                };

                this.selectActive = function() {
                    this.select($scope.active);
                };

                this.select = function(item) {
                    $scope.hide = true;
                    $scope.focused = true;
                    window.location.href = item.path;
                };

                $scope.isVisible = function() {
                    return !$scope.hide && ($scope.focused || $scope.mousedOver);
                };

                $scope.query = function() {
                    $scope.hide = false;
                    instantSearchFactory.multipleIndexSearch($scope.search_query,
                        {
                            indexes : indexes,
                            hitsPerPage : 3
                        },
                        {
                            onSuccess : function (content) {
                                populateResult(content)
                            },
                            onError : function (err) {
                                console.log(err);
                            }
                        }
                    );
                };

                $scope.hasAccounts = function () {
                    return $scope.result.accounts.length > 0;
                };

                $scope.hasEvents = function () {
                    return $scope.result.events.length > 0;
                };

                $scope.hasVideos = function () {
                    return $scope.result.videos.length > 0;
                };

                var populateResult = function (content) {
                    var index = 0;
                    angular.forEach($scope.result, function (value, key) {
                        $scope.result[key] = content[index].hits;
                        $scope.items = $scope.items.concat(content[index].hits);
                        index++;
                    });
                }

            }],

            link: function(scope, element, attrs, controller) {

                var searchField = angular.element(document.querySelector('.js-search'));
                var resultList = angular.element(document.querySelector('.js-instant_search_results'));

                searchField.on('focus', function() {
                    scope.$apply(function() { scope.focused = true; });
                });

                searchField.on('blur', function() {
                    scope.focused = false;
                    setTimeout(function () {
                        scope.items.length = 0;
                        scope.result.accounts.length = 0;
                        scope.result.events.length = 0;
                        scope.result.videos.length = 0;
                        scope.search_query = '';
                    }, 100)
                });

                resultList.on('mouseover', function() {
                    scope.$apply(function() { scope.mousedOver = true; });
                });

                resultList.on('mouseleave', function() {
                    scope.$apply(function() { scope.mousedOver = false; });
                });

                searchField.on('keyup', function(e) {
                    if (e.keyCode === 9 || e.keyCode === 13) {
                        scope.$apply(function() { controller.selectActive(); });
                    }

                    if (e.keyCode === 27) {
                        scope.$apply(function() { scope.hide = true; });
                    }
                });

                searchField.on('keydown', function(e) {
                    if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                        e.preventDefault();
                    };

                    if (e.keyCode === 40) {
                        e.preventDefault();
                        scope.$apply(function() { controller.activateNextItem(); });
                    }

                    if (e.keyCode === 38) {
                        e.preventDefault();
                        scope.$apply(function() { controller.activatePreviousItem(); });
                    }
                });

                scope.$watch('items', function(items) {
                    controller.activate(items.length ? items[0] : null);
                });

                scope.$watch('focused', function(focused) {
                    if (focused) {
                        searchField[0].focus();
                    }
                });

                scope.$watch('isVisible()', function(visible) {
                    if (visible) {
                        // var pos = searchField.position();
                        var height = searchField[0].offsetHeight;

                        resultList.css({
                            // top: pos.top + height,
                            // left: pos.left,
                            position: 'absolute',
                            display: 'block'
                        });
                    } else {
                        resultList.css('display', 'none');
                    }
                });
            }
        }

    }]);

    DirectiveModule.directive('typeaheadItem', function() {
        return {
            require: '^instantSearch',
            link: function(scope, element, attrs, controller) {

                var item = scope.$eval(attrs.itemType);
                scope.$watch(function() {

                    return controller.isActive(item);

                }, function(active) {
                    if (active) {
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                });

                element.on('mouseenter', function (e) {
                    controller.activate(item);
                });

                element.on('click', function (e) {
                    scope.$apply(function() { controller.select(item); });
                });
            }
        };
    });

})
