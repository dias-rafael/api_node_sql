//Initiallising node modules
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');

mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const apiroutes = require('./routes/api_routes');

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());
app.use('/', apiroutes); 
app.use(require('morgan')('dev'));
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!isProduction) {
  app.use(errorHandler());
}

const url_producao = ('mongodb://dev:4dm1n2020@costabrasil-shard-00-00-zemxu.mongodb.net:27017,costabrasil-shard-00-01-zemxu.mongodb.net:27017,costabrasil-shard-00-02-zemxu.mongodb.net:27017/costabrasil?ssl=true&replicaSet=CostaBrasil-shard-0&authSource=admin&retryWrites=true&w=majority');
const url_homologacao = ('mongodb://dev:4dm1n2020@costabrasil-shard-00-00-zemxu.mongodb.net:27017,costabrasil-shard-00-01-zemxu.mongodb.net:27017,costabrasil-shard-00-02-zemxu.mongodb.net:27017/costabrasilhomologacao?ssl=true&replicaSet=CostaBrasil-shard-0&authSource=admin&retryWrites=true&w=majority');

const url = url_homologacao //ALTERAR PARA HOMOLOGACAO OU PRODUCAO

mongoose.connect(url,{useNewUrlParser: true})
  .then(()=>{
    app.listen(4000);
    console.log('Database connected!');})
  .catch(err => console.log(err));

require('./model/users');
require('./config/passport');
app.use(require('./routes'));

if(!isProduction) {
app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
    errors: {
        message: err.message,
        error: err,
    },
    });
});
}

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
        message: err.message,
        error: {},
        },
    });
});

//Setting up server
app.listen(process.env.PORT || 3000, console.log('server started on port 3000'));