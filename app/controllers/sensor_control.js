let sensor = {};
var time = require('time');
var moment = require('moment');

sensor.insertData = async (application, request, response) => {

    var now = new time.Date()
    now.setTimezone("America/Sao_Paulo");

    let date = new Date();
    date = moment(date).format("YYYY-MM-DD HH:mm:ss");
}



module.exports = sensor; 