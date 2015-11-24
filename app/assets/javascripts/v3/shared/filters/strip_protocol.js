define([

    // Base filter module
    'ng_base/filter'

], function (

    FilterModule

) {

    FilterModule.filter('stripProtocol', function () {
        return function (url) {
            if (url) {
                return url.replace(/^(http|https):/, '');
            }
        }
    })

})
