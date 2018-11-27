const dataOfBeacon = require("../utils/analyzer").dataOfBeacon;
const time = require("time");
const moment = require("moment");
const uniqueIdGenerator = require("../utils/helpers").uniqueIdGenerator;
let track = {};

track.insertTrack = async (application, request, response) => {
  let errors = request.validationErrors();
  if (errors) response.send(errors);

  let now = new time.Date();
  now.setTimezone("America/Sao_Paulo");
  let date = new Date();
  date = moment(date).format("YYYY-MM-DD HH:mm:ss");
  
  let resultAlgoritm = dataOfBeacon(request.body);
  console.log(resultAlgoritm)
  let insertData = {
    ...resultAlgoritm,
    date,
    _id: uniqueIdGenerator()
  };
  let promiseInsertTrack = new Promise((resolve, reject) => {
    application.app.models.database.inserTrack(
      insertData,
      (insertTrack, device) => {
        if (insertTrack) {
          reject(insertTrack);
        } else {
          resolve(insertData);
        }
      }
    );
  });

  try {
    let result = await promiseInsertTrack;
    response.json(result);
  } catch (error) {
    console.warn(error);
    throw error;
  }
};

track.getLastLap = async (application, request, response) => {
  let errors = request.validationErrors();
  if (errors) response.send(errors);

  let promise = new Promise((resolve, reject) => {
    application.app.models.database.getLastLap('', (error, device) => {
      if (error) {
        reject(error);
      } else {
        resolve(device);
      }
    });
  });

  try {
    let result = await promise;
    response.send({ code: 200, result: result });
  } catch (error) {
    throw error;
  }
};

module.exports = track;
