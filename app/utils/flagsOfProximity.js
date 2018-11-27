module.exports = {
  distanceActiveFlag: distance => (distance <= 1 ? `NEAR` : `FAR`)
};
