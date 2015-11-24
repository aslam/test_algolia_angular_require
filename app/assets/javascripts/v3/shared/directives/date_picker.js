define([

    // library
    'ng_base/directive',

    // plugins
    'pikaday' // https://github.com/dbushell/Pikaday

], function (

    // library
    DirectiveModule,

    // plugins
    Pikaday

) {

    DirectiveModule.directive('datePicker', [function () {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {
                displayDate: '='
            },
            link: function (scope, element, attrs, ngModel) {
                var field = element[0];
                var calenedarElem = element.next();
                var picker = new Pikaday({
                    bound: true,
                    onSelect: function (date) {
                        ngModel.$setViewValue(date.toLocaleDateString());
                        ngModel.$render();
                        element.next().toggleClass('show');
                    }
                });
                element.on('click', function () {
                    element.next().toggleClass('show');
                });
                element.on ('blur', function() {
                    if (element.next().hasClass('show')) {
                        element.next().removeClass('show');
                    }
                });
                field.parentNode.insertBefore(picker.el, field.nextSibling);
            }
        };
    }]);
});
