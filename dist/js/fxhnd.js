(function(life) {
  var detectIE = function() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // IE 12 => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    // other browser
    return false;
  };
  var fxhnd = {};
  // cache the id
  var distinctId = null;
  fxhnd.distinctId = function(callback) {
    if (distinctId) {
      return callback(null, distinctId);
    }
    var u = /^https?:\/\/(.*\.)?datafoxden\.com$/.test(window.location.origin) ? "https://foxhound.datafoxden.com/" : "https://foxhound.datafox.co/";
    var x = (detectIE() === 9) ? new XDomainRequest() : new XMLHttpRequest();
    x.open('GET', u, true);
    x.responseType = 'json';
    x.withCredentials = true;
    x.onload = function() {
      var response = x.response;
      if (!response || !response.distinct_id) {
        callback(new Error("No distinct_id"));
      } else {
        distinctId = response.distinct_id;
        callback(null, response.distinct_id);
      }
    };
    x.onerror = function() {
      callback(new Error("Network error"));
    };
    x.send();
  };
  life.fxhnd = fxhnd;
})(window);
