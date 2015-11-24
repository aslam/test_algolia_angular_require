define([

    'underscore', 'underscore.string'

], function (_, _s) {

    // Import Underscore.string to separate object, because there are conflict functions:
    // _.include / _.reverse / _.contains
    _.str = _s;

});

