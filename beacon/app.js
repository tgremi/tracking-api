const noble = require("noble");
const BeaconScanner = require("node-beacon-scanner");

var scanner = new BeaconScanner();

scanner.onadvertisement = advertisement => {
  var beacon = advertisement["iBeacon"];
  beacon.rssi = advertisement["rssi"];
  console.log(`Distancia [${calculateDistance(beacon.rssi, beacon.txPower)}]`);

  console.log(JSON.stringify(beacon, null, "    "));
};

scanner
  .startScan()
  .then(() => {
    console.log("Scanning for BLE devices...");
  })
  .catch(error => {
    console.error(error);
  });

function calculateDistance(rssi) {
  var txPower = -59;
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

// noble.startScanning([]); // any service UUID, no duplicates

// noble.startScanning([], true); // any service UUID, allow duplicates

// var serviceUUIDs = ["<service UUID 1>"] // default: [] => all
// var allowDuplicates = false; // default: false

// noble.startScanning(serviceUUIDs, allowDuplicates,(error, resp)=> {console.log(resp)}); // particular UUID's
