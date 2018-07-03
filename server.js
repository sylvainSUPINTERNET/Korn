'use strict';

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


//Express config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));



//Routes
const auth_router = require('./routes/auth.router');


app.use('/auth',auth_router);




app.listen(port, () => console.log(`App listen on ${port}`));