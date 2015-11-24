// https://gist.github.com/its-florida/1290439

define([

    'jquery', 'spin'

], function ($, Spinner) {

    $.fn.spin = function (opts, color) {
        var presets = {
            "tiny" : { lines : 8, length : 2, width : 2, radius : 3 },
            "small" : { lines : 8, length : 4, width : 3, radius : 5 },
            "large" : { lines : 10, length : 8, width : 4, radius : 8 }
        };
        if (Spinner) {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data();

                if (data.spinner) {
                    data.spinner.stop();
                    delete data.spinner;
                }
                if (opts !== false) {
                    if (typeof opts === "string") {
                        if (opts in presets) {
                            opts = presets[opts];
                        } else {
                            opts = {};
                        }
                        if (color) {
                            opts.color = color;
                        }
                    }
                    data.spinner = new Spinner($.extend({color : $this.css('color')}, opts)).spin(this);
                }
            });
        } else {
            throw "Spinner class not available.";
        }
    };

});

//$.fn.spin = function(opts) {
//    this.each(function() {
//        var $this = $(this), data = $this.data();
//        if (data.spinner) {
//            data.spinner.stop();
//            delete data.spinner;
//        }
//        if (opts !== false) {
//            data.spinner = new Spinner($.extend({ color : $this.css('color') }, opts)).spin(this);
//        }
//    });
//    return this;
//};
//

