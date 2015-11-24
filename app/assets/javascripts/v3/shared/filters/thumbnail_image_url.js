define([

    'ng_base/filter'

], function (

    FilterModule

) {

    FilterModule.filter('thumbnailImageUrl', function () {
        var sanitizeUrl = function (url) {
            if (url === 'undefined' || url === '') {
                return url;
            }

            var re1 = /(https?:)(\/\/.*)(\.jpg|\.png|\.jpeg|\.gif)/i,
                re2 = /_(\d+)x(\d+)/i;

            var res1, res2, result, rel;
            var max_width  = 480,
                max_height = 210;

            if ((res1 = re1.exec(url)) !== null) {
                if (res1.index === re1.lastIndex) {
                    re1.lastIndex++;
                }
            }

            rel = res1[2];
            if ((res2 = re2.exec(rel)) !== null) {
                if (res2.index === re2.lastIndex) {
                    re2.lastIndex++;
                }
            }

            result = [res1[2], res1[3]].join('');
            if (res2 && res2[1] >= max_width) {
                var ratio  = max_width / parseFloat(res2[1]);
                var width  = parseInt(parseFloat(res2[1] * ratio));
                var height = parseInt(parseFloat(res2[2] * ratio));

                result = [res1[2], '_', width, 'x', height, res1[3]].join('');
            };

            return result;
        };

        return function (obj, defaultImage, objKeys) {
            var imageUrl,
                defaultPoster = defaultImage || '//cdn.blahblah.com/website/discover/blank_event.png',
                keys = objKeys || ['url', 'medium_url', 'small_url', 'thumb_url'];

            if (typeof obj === 'null' || typeof obj === 'undefined') {
                imageUrl = defaultPoster;
            } else if (obj instanceof Object) {

                for (var key in keys) {
                    if (obj.hasOwnProperty(keys[key]) && (obj[keys[key]] !== '' || obj[keys[key]] !== 'undefined')) {
                        imageUrl = obj[keys[key]];
                        break;
                    }
                }

                if (typeof imageUrl === 'undefined' || imageUrl.indexOf('poster-default') > 0) {
                    imageUrl = defaultPoster;
                } else {
                    imageUrl = sanitizeUrl(imageUrl);
                }

            } else {
                imageUrl = defaultPoster;
            }

            return imageUrl;
        }
    })

})
