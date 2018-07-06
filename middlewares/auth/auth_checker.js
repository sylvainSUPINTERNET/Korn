'use strict';

//JWT
const jwt = require('jsonwebtoken');
const jwt_conf = require('../../config/jwt');

let auth_checker = function(req,res,next){
    console.log("AUTH CHECKER TEST FROM MIDDLEWARE.");
    console.log("HEADER AUTH",req.headers.authorization)
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        console.log("TOKEN FROM AUTH HEADER", req.headers.authorization.split(' ')[1]);
        let header_token = req.headers.authorization.split(' ')[1];
        console.log(header_token.length);
        if(!header_token || header_token === ""){
            console.log("ERROR -> token undefined or empty")
            res.status(401).json({error:true, data: "You are not authorized. "})
        } else {
            jwt.verify(header_token, jwt_conf.secret, function(err, decoded){
                if(err){
                    if(err.name === "TokenExpiredError") {
                        //TODO if err === tOKENeXPIREDERROR bla bla , aller dans redis reset les 2 keys et utiliser l'ancienne ici et changer l'autre du coup
                        res.status(401).json({error:true, data: "You are not authorized ", error_stack:err})
                    } else {
                        res.status(401).json({error:true, data: "You are not authorized", error_stack: err})
                    }

                } else {
                    //DECODED WITH SUCCESS
                    console.log("DECODED",decoded);
                    next()
                }
            })
        }
    } else {
        console.log("ERROR ->", "nO AUTH IN HEADER")
        res.status(401).json({error:true, data: "You are not authorized."})
    }
};

module.exports = auth_checker;