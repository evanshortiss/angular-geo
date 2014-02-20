/*global window */

(function (angular) {
    'use strict';

    angular.module('geolocation', []).constant('GEOLOCATION_ERRORS', {
        1: 'PERMISSION_DENIED',
        2: 'POSITION_UNAVAILABLE',
        3: 'TIMEOUT',
        NO_SUPPORT: 'NO_SUPPORT'
    });


    angular.module('geolocation', []).constant('GEOLOCATION_DEFAULTS', {
        TIMEOUT: (20 * 1000),
        MAX_AGE: (10 * 1000)
    });


    angular.module('geolocation')
        .service('geolocation', ['$rootScope', '$window', 'GEOLOCATION_ERRORS', 'GEOLOCATION_DEFAULTS',
            function ($rootScope, $window, GEOLOCATION_ERRORS, GEOLOCATION_DEFAULTS) {

                /**
                 * Callback to fire if geolocation fails.
                 * Is this a nasty pattern...?
                 * @param   {Function} fn
                 * @return  {Function}
                 */
                function fail(fn) {
                    return function (err) {

                        $rootScope.$apply(function () {
                            // Is it a known error?
                            if (err && err.code && GEOLOCATION_ERRORS.hasOwnProperty(err.code) === true) {
                                return fn(GEOLOCATION_ERRORS[err.code], null);
                            } else {
                                return fn(GEOLOCATION_ERRORS.NO_SUPPORT, null);
                            }
                        });

                    };
                }


                /**
                 * Called when geolocation call succeeds.
                 * Is this a nasty pattern...?
                 * @param   {Function} fn
                 * @return  {Function}
                 */
                function success(fn) {
                    return function (position) {

                        $rootScope.$apply(function () {

                            if (position && position.coords && position.coords.timestamp) {
                                // Add timestamp to the coords object for consistency
                                position.coords.timestamp = position.timestamp;
                            }

                            // Returned object format
                            // obj.latitude;
                            // obj.longitude;
                            // obj.altitude;
                            // obj.accuracy;
                            // obj.altitudeAccuracy;
                            // obj.heading;
                            // obj.speed;
                            return fn(null, position.coords);
                        });

                    };
                }


                /**
                 * Check does the device support geolocation.
                 * @return {Boolean}
                 */
                function isSupported() {
                    return ($window.navigator && $window.navigator.geolocation ? true : false);
                }


                /**
                 * Request the user position from the device.
                 * @param {Boolean}     accurately
                 * @param {Number}      timeout
                 * @param {Number}      maximumAge
                 * @param {Function}    callback
                 */
                function getPosition(accurately, timeout, maximumAge, callback) {
                    // Detect callback use pattern
                    if (typeof timeout === 'function') {
                        callback = timeout;
                        maximumAge = null;
                        timeout = null;
                    }

                    if (isSupported() === true) {
                        $window.navigator.geolocation.getCurrentPosition(success(callback), fail(callback), {
                            enableHighAccuracy: accurately,
                            timeout: timeout || GEOLOCATION_DEFAULTS.TIMEOUT,
                            maximumAge: maximumAge || GEOLOCATION_DEFAULTS.MAX_AGE
                        });
                    } else {
                        // Wrap the callback
                        callback = fail(callback);
                        return callback(GEOLOCATION_ERRORS.NO_SUPPORT, null);
                    }
                }


                // Export these methods and data for use
                this.ERRORS = GEOLOCATION_ERRORS;
                this.isSupported = isSupported;


                /**
                 * Get user location without using GPS
                 * @param {Function} callback
                 */
                this.getCoarsePosition = function (timeout, maximumAge, callback) {
                    getPosition(false, timeout, maximumAge, callback);
                };


                /**
                 * Get location as accurately as possible.
                 * @param {Object} opts
                 */
                this.getFinePosition = function (timeout, maximumAge, callback) {
                    getPosition(true, timeout, maximumAge, callback);
                };
            }]);
}(window.angular));