'use strict';

const express = require('express');
const auth_router = express.Router();

//Controllers
const AuthCtrl = require('../controllers/auth.controller');


auth_router.post('/access',function(req, res) {
    AuthCtrl.accessAction(req,res);
});


module.exports = auth_router;
