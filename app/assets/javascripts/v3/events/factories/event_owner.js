define([

    // Base factory module
    'ng_base/factory'

], function (

    FactoryModule

) {

    FactoryModule.factory('eventOwner', function () {

        var account = window.config.event.owner;

        var allowedExtensions = ['jpg', 'jpeg', 'gif', 'png'];

        var owner = {
            id : account.id,
            full_name : account.full_name,
            short_name : account.short_name,
            description : account.description,
            timezone : account.timezone,
            gender : account.gender,
            background : {
                image : account.background_image,
                color : account.background_color,
                repeat : account.background_repeat,
                position : account.background_position
            },
            google_analytics_id : account.google_analytics_id,

            // return image based on requested type
            profilePicture : function (image_size) {
                var imageUrl, splitUrl, extension;
                if (account.picture) {
                    if (typeof image_size === 'string') {
                        imageUrl = account.picture[image_size];
                    } else if (typeof image_size === 'object' &&  account.picture.url) {
                        splitUrl = account.picture.url.split('.');
                        extension = splitUrl.splice(-1); // get extension
                        if (extension && allowedExtensions.indexOf(extension.toLowerCase() !== -1)) {
                            imageUrl = splitUrl.join('.') + '_' + image_size.width + 'x' +
                                image_size.height + extension;
                        }
                    }
                }
                return (typeof imageUrl === 'string' ?
                    imageUrl : '//cdn.blahblah.com/website/discover/blank_avatar.png');
            },

            links : function () {
                return account.links || [];
            },

            eventCount : function () {
                return account.upcoming_events.total + account.past_events.total;
            },

            followersCount : function () {
                return account.followers.total || 0;
            }

        }

        return owner;
    });

});
