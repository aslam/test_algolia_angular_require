define([

    // base module
    'ng_base/service'

], function (

    ServiceModule

) {

    ServiceModule.service('connection', ['$http', 'currentUser', function ($http, currentUser) {

        this.get = function (options) {
            var config = {
                method : 'GET',
                url : getRequestUrl(options),
                headers : getRequestHeaders(options),
                params : options.params,
                timeout : options.timeout || 30000
            };
            this.request(config, options);
        };

        this.post = function (options) {
            var config = {
                method : 'POST',
                url : getRequestUrl(options),
                data : options.data,
                headers : getRequestHeaders(options),
                params : options.params,
                timeout : options.timeout || 30000
            };
            this.request(config, options);
        };

        this.request = function (config, options) {
            $http(config)
                .success( function (data, status, headers, config) {
                    options.onSuccess(data, status);
                })
                .error( function (data, status, headers, config) {
                    options.onError(data, status);
                });
        };

        var getRequestHeaders = function (options) {
            options = options || {};
            var headers = {};
            if (options.authorize) {
                headers['Authorization'] = currentUser.authorizationToken();
            }
            // append if there are any custom headers
            angular.extend(headers, options.headers);
            return headers;
        };

        var getRequestUrl = function (options) {
            var url;
            options = options || {};
            if (options.api) {
                // TODO: check for CORS support and append api url accordingly
                url = '/api' + options.url;
            } else {
                url = options.url;
            }
            return url;
        };

    }]);

});
