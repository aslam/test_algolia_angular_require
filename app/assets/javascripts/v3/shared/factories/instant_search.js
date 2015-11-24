define([

    // Base factory module
    'ng_base/factory'

], function (

    FactoryModule

) {

    FactoryModule.factory('instantSearchFactory', ['algolia', function (algolia) {

        // temporary config, application id and key should be populated from server side
        var searchClient = algolia.Client('123456789', 'abcedfghijklmnopqrstuvwxyz');

        var buildQuery = function (query, options) {
            var queries = [];
            angular.forEach(options.indexes, function (indexName) {
                 this.push({
                    indexName : indexName,
                    query : query,
                    params : {
                        hitsPerPage : options.hitsPerPage
                    }
                 })
            }, queries);
            return queries;
        }

        var search = {
            multipleIndexSearch : function (query, options, callback) {
                queries = buildQuery(query, options);
                searchClient.search(queries, function (err, content) {
                    if (err) {
                        callback.onError();
                        return;
                    }
                    callback.onSuccess(content.results);
                });
            }
        }

        return search;

    }])

})
