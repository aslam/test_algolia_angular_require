define([
    'ng_base/directive'

], function (

    DirectiveModule

) {

    // ngPluralize directive doesn't support HTML tags in translations
    // see: https://github.com/angular/angular.js/issues/4790
    // copied shamelessly from: https://gist.github.com/imjoshholloway/e14cab6324f569fc911a

    DirectiveModule.directive('pluralizeWithHtml', ['$locale', '$interpolate', '$log', function ($locale, $interpolate, $log) {
        var BRACE = /{}/g,
            IS_WHEN = /^when(Minus)?(.+)$/;

        return {
            restrict: 'EA',
            link: function (scope, element, attr) {
                var numberExp           = attr.count,
                    whenExp             = attr.$attr.when && element.attr(attr.$attr.when), // we have {{}} in attrs
                    offset              = attr.offset || 0,
                    whens               = scope.$eval(whenExp) || {},
                    whensExpFns         = {},
                    startSymbol         = $interpolate.startSymbol(),
                    endSymbol           = $interpolate.endSymbol(),
                    numberFilter        = '| number',
                    braceReplacement    = startSymbol + numberExp + '-' + offset + numberFilter + endSymbol,
                    watchRemover        = angular.noop,
                    lastCount;

                angular.forEach(attr, function (expression, attributeName) {
                    var tmpMatch = IS_WHEN.exec(attributeName);
                    if (tmpMatch) {
                        var whenKey = (tmpMatch[1] ? '-' : '') + lowercase(tmpMatch[2]);
                        whens[whenKey] = element.attr(attr.$attr[attributeName]);
                    }
                });

                angular.forEach(whens, function (expression, key) {
                    whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));
                });

                scope.$watch(numberExp, function ngPluralizeWatchAction(newVal) {
                    var count = parseFloat(newVal);
                    var countIsNaN = isNaN(count);

                    if (!countIsNaN && !(count in whens)) {
                        // If an explicit number rule such as 1, 2, 3... is defined, just use it.
                        // Otherwise, check it against pluralization rules in $locale service.
                        count = $locale.pluralCat(count - offset);
                    }

                    // If both `count` and `lastCount` are NaN, we don't need to re-register a watch.
                    // In JS `NaN !== NaN`, so we have to exlicitly check.
                    if ((count !== lastCount) && !(countIsNaN && isNaN(lastCount))) {
                        watchRemover();
                        var whenExpFn = whensExpFns[count];
                        if (whenExpFn === undefined) {
                          $log.debug("ngPluralize: no rule defined for '" + count + "' in " + whenExp);
                          watchRemover = angular.noop;
                          updateElementText();
                        } else {
                          watchRemover = scope.$watch(whenExpFn, updateElementText);
                        }
                        lastCount = count;
                    }
                });

                function updateElementText(newText) {
                    element.html(newText || '');
                }
            }
        };
    }]);
})
