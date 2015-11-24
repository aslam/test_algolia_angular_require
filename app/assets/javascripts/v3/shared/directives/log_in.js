define([

    // Base directive module
    'ng_base/directive',

    // templates
    'text!ng_shared/templates/log_in.html'

], function (

    DirectiveModule,

    LogInTemplate

) {

    DirectiveModule.directive('logInStatus', ['currentUser', function (currentUser) {
        return {
            replace : true,
            restrict : 'E',
            template : LogInTemplate,
            link : function (scope, elem, attrs) {
                scope.is_logged_in = currentUser.isLoggedIn();
                scope.user_picture_url = currentUser.picture_url;
                scope.profile_url = currentUser.short_name ? ('/' + currentUser.short_name) : ('/accounts/' + currentUser.id);
            }
        }

    }]);

})
