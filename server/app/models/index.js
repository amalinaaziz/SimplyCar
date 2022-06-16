const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.vehicles = require("./vehicle.model.js")(mongoose, mongoosePaginate);
db.users = require("./user.model.js")(mongoose, mongoosePaginate);
db.vehicleAvailabilities = require("./vehicleAvailability.model.js")(mongoose, mongoosePaginate);

module.exports = db;
