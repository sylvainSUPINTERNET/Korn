'use strict';

//DB
const UserModel = require('../models/User.model');

//JWT
const jwt = require('jsonwebtoken');
const jwt_conf = require('../config/jwt');


//REDIS CLIENT
const redisClient = require('../Redis/client').client;
redisClient.on("error", function (err) {
    console.log("REDIS : error -> " + err);
});



module.exports = {

    accessAction: function(req,res){

        let login_email = req.body.email;
        let login_password= req.body.password;

        UserModel.findOrCreate({ email: login_email, password : login_password}, (err, userData) => {
            if(err){
                //TODO : template error here
                res.status(400).json({error: true, data:err})
            } else {
                //create token for login, and store in redis the refresh token
                jwt.sign({ email: userData.email }, jwt_conf.secret ,{ expiresIn: `${jwt_conf.expired}` }, function(err, token) {
                    if(err){
                        //TODO : template error here
                        res.status(400).json({error: true, data:err})
                    } else {
                        //DONT set expired date in the refresh token (add later)
                        let refreshToken = jwt.sign({email : userData.email}, jwt_conf.secret);
                        redisClient.set(userData._id + "_refreshToken", refreshToken, redisClient.print);
                        redisClient.set(userData._id + "_token", refreshToken, redisClient.print);
                        //TODO create middle to refresh the token (use jwt.verifiy and use error if its TokenExpiredError -> voir https://www.npmjs.com/package/jsonwebtoken
                        res.status(200).json({error:false, data: token})
                    }
                });

            }
        });

    }
};