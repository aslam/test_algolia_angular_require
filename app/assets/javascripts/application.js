require([

    'jquery',
    'jquery.rails',
    
], function ($) {
    require($('script[data-layout]').attr('data-layout')).init();
});
