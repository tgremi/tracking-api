// var bcrypt = require('bcrypt');

let users = {};
users.createUser = async (application, req, res) => {

    // req.assert("user_id", "user_id can't be empty.").notEmpty();
    let hashPass;
    let errors = req.validationErrors();
    if (errors) res.send(errors);
    // Definimos uma Hash para a armazenar a senha do usuário. 
    hashPass = bcrypt.hashSync(req.body.password, 10);

    let promiseUsers = new Promise((resolve, reject) => {
        let data = {
            _id: application.app.utils.helpers.uniqueIdGenerator(),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email.toLowerCase(),
            age: req.body.age,
            password: hashPass,
            country: req.body.country,
            elderly: {
                first_name: '',
                last_name: '',
                age: '',
                weight: '',
                height: '',
            },
            contacts: [
                {
                    name: '',
                    celphone: '',
                }
            ]

        };
        application.app.models.database.insertUsers(data, (getUsersError, users) => {
            if (getUsersError)
                reject(getUsersError);
            else resolve(users);
        });
    });

    try {
        let result = await promiseUsers;
        res.send({ code: 200, update: true, message: result });
    } catch (error) {
        res.send({ message: 'Error on createUser', error: error });
    }
}

users.updateElderlyField = async (application, req, res) => {

    let promiseUpdateUser = new Promise((resolve, reject) => {
        let data = {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            weight: req.body.weight,
            height: req.body.height,
            birth_day: req.body.birth_day,
        }
        console.log(data)
        application.app.models.database.updateElderlyField(data, (getUserError, user) => {
            if (getUserError) {
                console.log(getUserError);
                reject(getUserError);
            }
            else {
                // console.log(user);
                resolve(user);
            }
        });
    });

    try {
        let response = await promiseUpdateUser;
        res.send({ code: 200, update: true, message: response });
    } catch (error) {
        res.send({ message: 'Error on updateUser', error: error });
    }

}

users.addContacts = async (application, req, res) => {

    let promiseUpdateUser = new Promise((resolve, reject) => {

        let contacts = req.body.contacts;

        contacts.map((contact, i) => {
            let phone = '55';
            phone += contact.number.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')
            contact.number = phone
        })

        let data = {
            email: req.body.email,
            contacts: contacts
        }
        application.app.models.database.addContacts(data, (getUserError, user) => {
            if (getUserError) {
                console.log(getUserError);
                reject(getUserError);
            }
            else {
                // console.log(user);
                resolve(user);
            }
        });
    });

    try {
        let response = await promiseUpdateUser;
        res.send({ code: 200, update: true, message: response });
    } catch (error) {
        res.send({ message: 'Error on updateUser', error: error });
    }

}

users.getUser = async (application, req, res) => {
    console.log('chegou nop GET')
    let promise = new Promise((resolve, reject) => {
        application.app.models.database.getUsers(req.params.email.toLowerCase(), (error, user) => {
            if (error) reject(error);
            else {
                console.log(user);
                resolve(user);
            }
        });
    });

    try {
        let response = await promise;
        console.log(response);
        res.send({
            user: response,
            code: 200,
            response: true
        })
    } catch (error) {
        throw error;
    }

}



module.exports = users;


