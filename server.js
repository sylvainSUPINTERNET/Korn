'use strict';

//jwt
const jwt_conf = require('./config/jwt');

//SESSION
const session = require('express-session');
const cookieParser = require('cookie-parser');

 //config
const db_conf = require('./config/db');
const server_conf = require('./config/server');
const port = process.env.PORT || server_conf.port.dev;
const cors = require('cors');

//Mongo connection
const mongoose = require('mongoose');
mongoose
    .connect(`mongodb://${db_conf.host}/${db_conf.name}`)
    .catch(err => res.json(err, err.stack));

// Redis client setup
const redisClient = require('./Redis/client').client;
redisClient.on("error", function (err) {
    console.log("REDIS : error -> " + err);
});

//Routing / Request handler
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


//DEBUG
const colorizedWith = require('chalk');
const morgan = require('morgan')



//Express config
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.set('view engine', 'ejs');

app.use(cookieParser('devSecret'))
// TODO:  ATTENTION POUR LES SESSION ! SI ON POST DEPUIS POSTMAN l'id de la session se réfère à celle de postman. Donc soit on test toute les route get / post via postman pour etre sur la même session ou tous sur app mais pas les deux


app.use(session({ secret: 'devSecret', cookie: { maxAge: 60000 }}))


// DEBUG ROUTES
app.use('*', function(req,res,next){
    console.log(colorizedWith.redBright("\n________  DEBUG CURRENT SESSION __________\n"));
    console.log(req.session);
    console.log(colorizedWith.redBright("___________________________________________\n"));
    next();
});

//test
//TODO header authorization JWT bearer
let middleware_auth_check = require('./middlewares/auth/auth_checker');
app.get('/test',middleware_auth_check,function(req,res){
    res.send("test")
});


//Routes
const auth_router = require('./routes/auth.router');


app.use('/auth',auth_router);










app.listen(port, () => console.log(`App listen on ${port}`));