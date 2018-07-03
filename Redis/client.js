'use strict';
const redis = require("redis"),
    client = redis.createClient();


module.exports = {
  client : client
};