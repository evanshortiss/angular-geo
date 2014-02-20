# Angular Geolocation

A simple wrapper for accessing geolocation features within AngularJS.

## Tests
Need to write tests.

To run the tests run the script **test.sh**. You will need to have node.js and npm installed to do this. Running the tests will run jshint, jslint and a series of test cases.

## API

All methods require a callback with the following format:

```
function(err, res) {
  // Sample error handling code...
  if(err) {
    console.log('Unable to get user position.');
  } else {
    // Returned object format
    // res.latitude;
    // res.longitude;
    // res.altitude;
    // res.accuracy;
    // res.altitudeAccuracy;
    // res.heading;
    // res.speed;
  }
}
```

### Errors
The error returned to your callback is either **null** or one of the following strings.

#####PERMISSION_DENIED
The user has not allowed access to their location.

#####POSITION_UNAVAILABLE
Returned when a user's position could not be calculated.

#####TIMEOUT
Acquiring the users position took longer than allowed.

#####NO_SUPPORT
The device/browser does not support geolocation.

### Functions
##### getCoarsePosition([timeout, [maximumAge]], callback)
Gets a users position quickly and a little less accurately than **getFinePosition**. Callback is the only required paramater.

##### getFinePosition([timeout, [maximumAge]], callback)
Gets a users position accurately as possible. Callback is the only required paramater.

