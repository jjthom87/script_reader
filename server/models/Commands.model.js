var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommandsSchema = new Schema({
	ls: Number,
	pwd: Number,
	cd: Number
});

module.exports = mongoose.model('Commands', CommandsSchema);