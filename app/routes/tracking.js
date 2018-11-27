module.exports = application => {
  /*
   *
   *  post beacon locate
   *
   */

  application.post("/dataFromBeacon", (req, res) => {
    // let data = require("../utils/analyzer").dataOfBeacon;
    // data(req.body);
    application.app.controllers.track.insertTrack(application, req, res);
  });

  /*
   *
   *  Update User
   *
   */

  application.get("/getBeaSecData", (req, res) => {
    application.app.controllers.track.getLastLap(application, req, res);
  });

  /*
   *
   * Control (update last time)
   *
   */

  application.post("/update-last-time", (req, res) => {
    application.app.controllers.trackControl.updateLastTime(
      application,
      req,
      res
    );
  });

  /*
   *
   * Device control
   *
   */
  application.post("/insert-device", (req, res) => {
    application.app.controllers.device.insertDevice(application, req, res);
  });

  application.post("/register-device", (req, res) => {
    application.app.controllers.device.registerDevices(application, req, res);
  });

  application.post("/login", (req, res) => {
    application.app.controllers.login.openSession(application, req, res);
  });

  application.post("/data-sensor", (req, res) => {
    application.app.controllers.sensor_control.insertData(
      application,
      req,
      res
    );
  });

  application.get("/", (req, res) => {});

  application.get("/getUser/:email", (req, res) => {
    application.app.controllers.users.getUser(application, req, res);
  });

  application.get("/get-notification/:email", (req, res) => {
    console.log("GetNotification!");
    application.app.controllers.notifier.getNotification(application, req, res);
  });

  application.post("/confirm-notify", (req, res) => {
    application.app.controllers.notifier.updateNotification(
      application,
      req,
      res
    );
  });
};
