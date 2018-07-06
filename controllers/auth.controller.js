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
        let current_session = req.session;

        let login_email = req.body.email;
        let login_password= req.body.password;

        UserModel.findOrCreate({ email: login_email, password : login_password}, (err, userData) => {
            if(err){
                res.status(400).json({error: true, data:err})
            } else {
                //create token for login, and store in redis the refresh token
                jwt.sign({ email: userData.email }, jwt_conf.secret ,{ expiresIn: `${jwt_conf.expired}` }, function(err, token) {
                    if(err){
                        res.status(400).json({error: true, data:err})
                    } else {
                        //DONT set expired date in the refresh token (add later)
                        let refreshToken = jwt.sign({email : userData.email}, jwt_conf.secret);

                        redisClient.set(userData._id + "_refreshToken", refreshToken, redisClient.print);
                        redisClient.set(userData._id + "_token", refreshToken, redisClient.print);

                        current_session.user_redis_key_token = userData._id + "_token";
                        current_session.user_redis_key_token_refresh = userData._id + "_refreshToken";

                        current_session.save(function(err){
                            if(err){
                                res.status(400).json({error:true, data: err})
                            } else {
                                //SET authorization
                                res.status(200).json({error:false, data: token})
                            }
                        });
                    }
                });

            }
        });

    },

};