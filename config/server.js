let express = require('express');
let consign = require('consign');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');
let uniqueIdGenerator = require('../app/utils/helpers').uniqueIdGenerator;
const database = require('./database.js');
let momentTz = require('moment-timezone'); 

console.log(`pi${uniqueIdGenerator()}vii`)
database.connect().catch((error) => {
    process.exit()
});

let app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.set(momentTz.tz("America/Sao_Paulo"));
app.use(expressValidator());

app.use(express.static('./app/public'));

app.use((req, res, next) => { //next é usado para dar continuação no fluxo da aplicação
    res.setHeader('Access-Control-Allow-Origin', '*'); //Habilita requisições de dominios diferentes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); //Pré-configura quais métodos podem ser usados
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, url'); //Habilita que a requisição efetuada pela origem tenha cabeçalhos (headers) reescritos
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

consign()
    .then('app/routes')
    .then('app/models')
    .then('app/utils')
    .then('app/controllers')
    .into(app);

module.exports = app;