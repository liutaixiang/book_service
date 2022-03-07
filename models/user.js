var mongoose = require('../common/db');

var user = new mongoose.Schema({
	username: String,
	password: String,
	userMail: String,
	userPhone: String,
	userAdmin: Boolean,
	userPower: Number,
	userStop: Boolean
});

//用户的查找方法
user.statics.findAll = function(callBack) {
	this.find({}, callBack);
}

user.statics.findByUsername = function(name, callBack) {
	this.find({username: name}, callBack);
}

user.statics.findUserLogin = function(name, password, callBack) {
	this.find({username: name, password: password, userStop: false}, callBack);
}

user.statics.findUserPassword = function(name, mail, phone, callBack) {
	this.find({username: name, userMail: mail, userPhone: phone}, callBack);
}

user.statics.findById = function(user_id, callBack) {
	this.find({_id: user_id}, callBack);
}

var userModel = mongoose.model('user', user);
module.exports = userModel;