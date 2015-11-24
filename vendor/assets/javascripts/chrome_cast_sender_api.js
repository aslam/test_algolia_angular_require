define([], function () {
    var initalizeGoogleAPI = function(mainElement, scriptTag, ElementID) {        
        var newElement, tags = mainElement.getElementsByTagName(scriptTag)[0];
        if (!mainElement.getElementById(ElementID)) {            
            newElement = mainElement.createElement(scriptTag);
            newElement.id = ElementID;
            newElement.async = true;
            newElement.src = '//www.gstatic.com/cv/js/sender/v1/cast_sender.js';
            tags.parentNode.insertBefore(newElement, tags);
        }
    }

    initalizeGoogleAPI(document, 'script', 'chromeCastSenderApi');
});
