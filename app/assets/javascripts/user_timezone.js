define([

    'timezone'

], function (Timezone) {

    var UserTimeZone = (function () {
        var instance = null;

        var isInternetExplorer = function () {
            return /MSIE/.test(navigator.userAgent);
        };

        var getCookie = function (name) {
            if (document.cookie.length > 0) {
                startIndex = document.cookie.indexOf(name + '=');
                if (startIndex !== -1) {
                    startIndex = startIndex + name.length + 1;
                    endIndex = document.cookie.indexOf(';', startIndex);
                    if (endIndex === -1) {
                        endIndex = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(startIndex, endIndex));
                }
            }
            return null;
        }

        var createInstance = function () {
            var timeZone, user;
            var DEFAULT_TIME_ZONE = 'America/New_York';

            try {
                var cu = getCookie('__cu');
                if (cu !== null) {
                    user = JSON.parse(cu);
                }
            } catch (error) {
                // catch json parse error
            }
            // To check whether user is logged in or not
            if (typeof user !== 'undefined') {
                // if logged in user's timezone is not set use default
                timeZone = user.timezone || DEFAULT_TIME_ZONE;
            } else if (isInternetExplorer()) {
                timeZone = DEFAULT_TIME_ZONE;
            }

            return new Timezone(timeZone);
        };

        return {
            getInstance : function () {
                if (!instance) {
                    instance = createInstance();
                }
                return instance;
            },

            setTimezone : function (timezone) {
                instance = new Timezone(timezone || DEFAULT_TIME_ZONE);
            }
        };
    })();

    return UserTimeZone;
});
