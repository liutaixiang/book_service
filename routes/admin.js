var express = require('express');
var router = express.Router();

var user = require('../models/user');
var movie = require('../models/movie');

router.post('/movieAdd', function(req, res, next) {
	if (!req.body.username) {
		res.json({status: 1, message: '用户名为空'});
		return;
	}
	if (!req.body.token) {
		res.json({status: 1, message: '登录出错'});
		return;
	}
	if (!req.body.id) {
		res.json({status: 1, message: '用户传递错误'});
		return;
	}
	if (!req.body.movieName) {
		res.json({status: 1, message: '电影名称为空'});
		return;
	}
	if (!req.body.movieImg) {
		res.json({status: 1, message: '电影图片为空'});
		return;
	}
	if (!req.body.movieDownload) {
		res.json({status: 1, message: '电影下载地址为空'});
		return;
	}
	
	var movieMainPage = false;
	if (!req.body.mpvieMainPage) {
		movieMainPage = false;
	}
	
	var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
	if (check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				var saveMovie = new movie({
					movieName: req.bidy.movieName,
					movieImg: req.body.movieImg,
					movieVideo: req.body.movieVideo,
					movieDownload: req.body.movieDownload,
					movieTime: Date.now(),
					movieNumSuppose: 0,
					movieNumDownload: 0,
					movieMainPage: movieMainPage
				});
				
				saveMovie.save(function(err) {
					if (err) {
						res.json({status: 1, message: err});
					} else {
						res.json({status: 0, message: "添加成功"});
					}
				})
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		});
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/movieDel', function(req, res, next) {
	if (!req.body.movieId) {
		res.json({status: 1, message: "电影id传递失败"});
		return;
	}
	if (!req.body.username) {
		res.json({status: 1, message: "用户名为空"});
		return;
	}
	if (!req.body.token) {
		res.json({status: 1, message: "登录出错"});
		return;
	}
	if (!req.body.id) {
		res.json({status: 1, message: "用户传递错误"});
		return;
	}
	var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
	if (check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				movie.remove({_id: req.body.movieId}, function(err, delMovie) {
					res.json({status: 0, message: '删除成功', data: delMovie});
				})
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

function checkAdminPower (username, token, id) {
	if (!username) {
		return {error: 1, message: '登录出错'};
	}
	if (!token) {
		return {error: 1, message: '登录出错'};
	}
	if (!id) {
		return {error: 1, message: '登录出错'};
	}
	return {error: 0, message: '成功'};
}

module.exports = router;