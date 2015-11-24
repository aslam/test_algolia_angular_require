define([

    // library
    'ng_base/factory'

], function (

    // library
    FactoryModule

) {

    FactoryModule.factory('currentUser', ['$cookies', function ($cookies) {
        var __cu = $cookies.get('__cu');
        var currentUser = typeof __cu === 'string' ? JSON.parse(__cu) : {};
        var user = {
            isLoggedIn : function () {
                return typeof currentUser.id !== 'undefined'; // if user id is present assuming user is logged in
            },

            authorizationToken : function () {
                return this.isLoggedIn() ? 'Bearer ' + currentUser.authorizationToken : {};
            },

            id : currentUser.id,

            full_name : currentUser.full_name,

            email_id : currentUser.email_original,

            short_name : currentUser.short_name,

            timezone : currentUser.timezone,

            picture_url : currentUser.picture_url || '//cdn.blahblah.com/website/discover/blank_avatar.png',

            plan : function () {
                var planType;
                if (!this.isLoggedIn()) {
                    return planType;
                } else if (currentUser.is_free) {
                    planType = 'Free';
                } else if (currentUser.is_basic) {
                    planType = 'Basic';
                } else if (currentUser.is_premium) {
                    planType = 'Premium';
                } else if (currentUser.is_enterprise) {
                    planType = 'Enterprise'
                }
                return planType;
            },

            plan_info : currentUser.plan_info,

            days_since_creation : currentUser.days_since_creation

        }

        return user;
    }]);

});
