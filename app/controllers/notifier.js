var http = require("http");
let notify = {}
let time = require('time')
let moment = require('moment');
let database = require('../models/database');
let helpers = require('../utils/helpers')
notify.sendSms = async (application, req, res) => {
    var now = new time.Date()
    now.setTimezone("America/Sao_Paulo");

    let date = new Date();
    date = moment(date).format("YYYY-MM-DD HH:mm:ss");
    var options = {
        "method": "POST",
        "hostname": "www.misterpostman.com.br",
        "port": null,
        "path": `/gateway.aspx?UserID=1327e4fd-4475-4484-aefa-70b07dc0f10a&Token=90179312&NroDestino=11940027216&Mensagem=HealthCareApp%20avisa%3A%20Parece%20ter%20acontecido%20algum%20imprevisto%20com%20o%20usu%C3%A1rio%5BThalles%20Gremi%5D%2C%20entre%20em%20contato%20urgente.!`,
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "4bed2cc3-f0d9-6b9c-1fbf-445c6cdc63cc"
        }
    };
    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.end();

}

notify.app = async (data, callbackFunc) => {

    database.getUsersWithDeviceSerieNumber(data.hardware_number, (error, success) => {
        var now = new time.Date()
        now.setTimezone("America/Sao_Paulo");

        let date = new Date();
        date = moment(date).format("YYYY-MM-DD HH:mm:ss");

        let notification = {
            _id: helpers.uniqueIdGenerator(),
            created: date,
            email: success.email,
            hardware_number: success.devices,
            user: success.first_name,
            elderly: {
                name: success.elderly.first_name
            },
            message: `${success.first_name} entre em contato com o ${success.elderly.first_name}${success.elderly.last_name}`,
            /*
             * Alert Viewer será alterado quando o usuário notificar pelo App que já efetuou contato com a pessoa. 
             */
            alert_viewer: false
        }


        database.insertDataNotification(notification, (error, success) => {
            if (error) {
                if (typeof callbackFunc == 'function') {
                    callbackFunc({ message: 'Erro ao inserir notificação', error: error }, undefined);
                }
            }
            else {
                if (typeof callbackFunc == 'function') {
                    callbackFunc(undefined, success);
                }
            }
        })



    })
}


notify.getNotification = async (application, req, res) => {
    let promise = new Promise((resolve, reject) => {
        application.app.models.database.getNotificationWithEmail(req.params.email.toLowerCase(), (error, success) => {
            if (error) reject(error);
            else resolve(success);
        })
    })

    try {
        let result = await promise;

        res.send({
            user: result[0],
            code: 200,
            response: true
        })
    } catch (error) {
        throw error
    }
}


notify.updateNotification = async (application, req, res) => {
    let data = {
        _id: req.body._id,
        email: req.body.email.toLowerCase(),
        message: req.body.message
    }

    application.app.models.database.updateNotificationWithEmail(data, (error, success) => {
        if (error) {
            throw error
        }
        else {
            res.send({
                code: 200,
                update: true
            })
        }
        ;
    })







}

module.exports = notify; 