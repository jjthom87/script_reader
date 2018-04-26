require('dotenv').config()
var fs = require('fs');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');

//express
var app = express();

//mongoose items
var CommandsSchema = require('./models/Commands.model.js');
var ScriptsSchema = require('./models/Scripts.model.js');
const mongourl = `mongodb://jjthom87:${process.env.MLAB_PASS}@ds141242.mlab.com:41242/command_storage`;
const recordId = "59f6784b0838b8b6b5a9297c";

mongoose.connect(mongourl, function(err,res){
	if(err){
		console.log("Error connection to: command_storage. " + err);
	} else {
		console.log("Succeeded connecting to command_storage");
	}
});

function Commands(){
	this.cd = 0;
	this.ls = 0;
	this.pwd = 0;
}

var commands = new Commands();

app.use('/static', express.static('client'));

if(process.env.LOCAL){
	setInterval(function(){
		fs.readFile(process.cwd() + '/client/public/history_log.txt', 'utf-8', function(err,body){
			ScriptsSchema.findOne({"_id": recordId}).exec(function(err,scriptsDoc){
				if(scriptsDoc.script !== body){
					ScriptsSchema.findOneAndUpdate({"_id": recordId}, {'script': body}).exec(function(err,updateDoc){
						console.log("Doc Updated")
					});
					var filter = body.split("\n").filter((s) => {
						return s.indexOf("bash-3.2$") > -1
					})
					for(var i = 0; i < filter.length; i++){
						filter[i] = filter[i].split("bash-3.2$ ")[1].split("\r")[0].split(" ")[0];
					}
					filter.forEach((f) => {
						switch(f){
							case 'cd':
								commands.cd++;
								break;
							case 'ls':
								commands.ls++;
								break;
							case 'pwd':
								commands.pwd++;
								break;
						}
					});
					CommandsSchema.insertMany(commands);
					commands = new Commands();
				}
			});
		});
	}, 2000);
}

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.get('/stuff', function(req,res){
	CommandsSchema.find().exec(function(err,findDoc){  
		res.json(findDoc);
	});
})

app.get('/stuff/whatever.zip', function(req,res){
	res.json("Hello")
})

var PORT = process.env.PORT || 8000;

app.listen(PORT);