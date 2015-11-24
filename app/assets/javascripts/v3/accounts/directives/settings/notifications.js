define([

    'ng_base/directive'

], function (

    DirectiveModule

) {

    DirectiveModule.directive('notificationSettings', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var allCheckboxes = angular.element(document.querySelectorAll('.js-icon_chkbox'));

                allCheckboxes.on('click', function () {
                    var selected_chkbox = angular.element(this);
                    if(selected_chkbox.hasClass('icon_chkbox')) {
                        selected_chkbox.removeClass('icon_chkbox').addClass('icon_chkbox_checked');
                    } else if(selected_chkbox.hasClass('icon_chkbox_checked')) {
                        selected_chkbox.removeClass('icon_chkbox_checked').addClass('icon_chkbox');
                    }
                });
            }
        };
    });

});
