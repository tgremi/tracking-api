let helpers = {};

helpers.uniqueIdGenerator = () => {
  this.length = 18;
  this.timestamp = +new Date();
  var _getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var ts = this.timestamp.toString();
  var parts = ts.split("").reverse();
  var id = "";

  for (var i = 0; i < this.length; ++i) {
    var index = _getRandomInt(0, parts.length - 1);
    id += parts[index];
  }
  return id;
};

helpers.getRange = (txCalibratedPower, rssi) => {
  let ratio_db = txCalibratedPower - rssi;
  let ratio_linear = Math.pow(10, ratio_db / 10);
  let r = Math.sqrt(ratio_linear);
  return r;
};


helpers.calculateDistance=(rssi) => {
  var txPower = -70; //hard coded power value. Usually ranges between -59 to -65

  if (rssi == 0) {
    return -1.0;
  }

  var ratio = (rssi * 1.0) / txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio, 10);
  } else {
    var distance = 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
    return distance;
  }
}

module.exports = helpers;
