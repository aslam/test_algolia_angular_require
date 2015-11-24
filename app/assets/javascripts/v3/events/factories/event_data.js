define([

    // Base factory module
    'ng_base/factory',

    // timezone library
    'user_timezone',

    // dependent factories
    'ng_events/factories/event_owner',
    'ng_shared/factories/current_user',

], function (

    FactoryModule,

    UserTimeZone

) {

    FactoryModule.factory('eventData', ['eventOwner', 'currentUser', function (EventOwner, CurrentUser) {

        var eventObject = window.config.event;

        var user_timezone = UserTimeZone.getInstance();

        var allowedExtensions = ['jpg', 'jpeg', 'gif', 'png'];

        var event_data =  {
            id : eventObject.id,
            owner : EventOwner,
            short_name : eventObject.short_name,
            full_name : eventObject.full_name,
            description : eventObject.description,
            background : {
                image : eventObject.background_image ?
                    eventObject.background_image : EventOwner.background.image,
                color : eventObject.background_color,
                repeat : eventObject.background_repeat,
                position : eventObject.background_position
            },
            live_video_post_id : eventObject.live_video_post_id,
            // this parameter can be used to watch and determine whether event is live or not
            is_live : angular.isObject(eventObject.stream_info),

            // return image based on requested type
            poster : function (image_size) {
                var imageUrl, splitUrl, extension;
                if (eventObject.logo) {
                    if (typeof image_size === 'string') {
                        imageUrl = eventObject.logo[image_size];
                    } else if (typeof image_size === 'object' && eventObject.logo.url) {
                        splitUrl = eventObject.logo.url.split('.');
                        extension = splitUrl.splice(-1); // get extension
                        if (extension && allowedExtensions.indexOf(extension.toLowerCase() !== -1)) {
                            imageUrl = splitUrl.join('.') + '_' + image_size.width + 'x' +
                                image_size.height + extension;
                        }
                    }
                }
                return (typeof imageUrl === 'string' ?
                    imageUrl : '//cdn.blahblah.com/website/discover/blank_event.png');
            },

            startTime : function () {
                return eventObject.start_time ?
                    user_timezone.initializeTime(eventObject.start_time) : undefined;
            },

            endTime : function () {
                return eventObject.end_time ?
                    user_timezone.initializeTime(eventObject.end_time) : undefined;
            },

            stream : function () {
                return eventObject.stream_info;
            },

            attachStream : function (data) {
                eventObject.stream_info = data;
                this.is_live = angular.isObject(eventObject.stream_info);
            },

            status : function () {
                var status;
                if (eventObject.is_draft ||
                    !(angular.isString(eventObject.start_time)) ||
                    !(angular.isString(eventObject.end_time))) {
                        status = 'draft';
                } else if (this.isLive()) {
                    status = 'live';
                } else if (this.startTime() <= user_timezone.initializeTime()
                    && this.endTime() > user_timezone.initializeTime()) {
                        status = 'in_progress';
                }  else if (this.startTime().subtract(6, 'hour') < user_timezone.initializeTime()
                    && user_timezone.initializeTime() < this.startTime()) {
                        status = 'countdown';
                } else if (this.startTime() > user_timezone.initializeTime()) {
                    status = 'future';
                } else if (this.endTime() <= user_timezone.initializeTime()) {
                    status = 'past';
                }
                return status;
            },

            isLive : function () {
                return this.is_live;
            },

            isPasswordProtected : function () {
                return eventObject.is_password_protected || false;
            },

            isEmbeddable : function () {
                return eventObject.is_embeddable || false;
            },

            isWhiteLabeled : function () {
                return eventObject.is_white_labeled || false;
            },

            isAdEnabled : function () {
                return eventObject.ad_enabled || false;
            },

            adDetails : function  () {
                return {
                    ad_account_id : eventObject.ad_account_id,
                    ad_provider_id : eventObject.ad_provider_id,
                    ad_custom_params : eventObject.ad_custom_params,
                    ad_enabled_for_vod : eventObject.ad_enabled_for_vod || true,
                    ad_enabled_for_live : eventObject.ad_enabled_for_live || true,
                    ad_enabled_for_owner : eventObject.ad_enabled_for_owner || true,
                    ad_types : eventObject.ad_types
                }
            },

            isChatEnabled : function () {
                return eventObject.live_chat_enabled || true;
            },

            isCommentsEnabled : function () {
                return eventObject.post_comments_enabled || true;
            },

            isPrivate : function () {
                return !eventObject.is_public || false;
            },

            links : function () {
                return eventObject.links || [];
            },

            isOwner : function () {
                return (CurrentUser.isLoggedIn() && CurrentUser.id === EventOwner.id)
            }

        };

        return event_data;

    }])

})
