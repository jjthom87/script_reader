var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ScriptsSchema = new Schema({
	script: String
});

module.exports = mongoose.model('Scripts', ScriptsSchema);