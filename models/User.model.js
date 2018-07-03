//Require Mongoose
const mongoose = require('mongoose');

//PLUGINS mongo
const plugins = require('./db_plugins');

//Define a schema
let Schema = mongoose.Schema;

let UserModelSchema = new Schema({
    firstname: {type: String},
    lastname: {type: String},
    email: {type: String},
    password: {type: String}
});

//Attach plugin to this ModelSchema
UserModelSchema.plugin(plugins.findOrCreate);


let UserModel = mongoose.model('Users', UserModelSchema );



module.exports = UserModel;
