let analyzer = {};
let moment = require("moment");
const flags = require("./flagsOfProximity").distanceActiveFlag;
const getRange = require("../utils/helpers").getRange;
analyzer.dataOfBeacon = arrOfDataBeacon => {
  let total = 0;

  for (let i = 0; i < arrOfDataBeacon.length; i++) {
    total += arrOfDataBeacon[i].rssi;
  }

  let meanRssi = total / arrOfDataBeacon.length;
  let distance = getRange(-70, meanRssi);
  let flag = flags(distance);
  let beaconId = arrOfDataBeacon[0].minor;

  console.log(`Media: ${meanRssi}`);
  console.log(
    `Distancia: ${distance} \n beaconId: ${beaconId} \n Flag: ${flag} \n\n`
  );
  return { beaconId: arrOfDataBeacon[0].minor, distance: distance, flag };
};

module.exports = analyzer;
