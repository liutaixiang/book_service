var express = require('express');
var router = express.Router();

var user = require('../models/user');
var movie = require('../models/movie');
var comment = require('../models/comment');
var article = require('../models/article');
var recommend = require('../models/recommend');

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

router.post('/movieUpdate', function(req, res, next) {
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
	
	var saveData = req.body.movieInfo;
	var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
	if (check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				movie.update({_id: req.body.movieId}, function(err, updateMovie) {
					res.json({status: 0, message: '修改成功', data: updateMovie});
				})
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.get('/movie', function(req, res, next) {
	movie.findAll(function(err, allMovie) {
		res.json({status: 0, message: "获取成功", data: allMovie});
	});
});

router.get('/commentsList', function(req, res, next){
	comment.findAll(function(err, allComment) {
		res.json({status: 0, message: "获取成功", data: allComment});
	});
});

router.post('/checkComment', function(req, res, next) {
	if (!req.body.commentId) {
		res.json({status: 1, message: "评论id传递失败"});
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
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				comment.update({_id: req.body.commentId}, {check: true}, function(err, updateComment) {
					res.json({status: 0, message: '审核成功', data: updateComment});
				})
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/delComment', function(req, res, next) {
	if (!req.body.commentId) {
		res.json({status: 1, message: "评论id传递失败"});
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
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				comment.remove({_id: req.body.commentId}, function(err, delComment) {
					res.json({status: 0, message: '删除成功', data: delComment});
				})
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/stopUser', function(req, res, next) {
	if (!req.body.userId) {
		res.json({status: 1, message: "用户id传递失败"});
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
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				user.update({_id: req.body.userId}, {userStop: true}, function(err, updateUser) {
					res.json({status: 0, message: '封停成功', data: updateUser});
				})
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/changeUser', function(req, res, next) {
	if (!req.body.userId) {
		res.json({status: 1, message: "用户id传递失败"});
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
	if (!req.body.newPassword) {
		res.json({status: 1, message: "用户新密码错误"});
		return;
	}
	var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				user.update({_id: req.body.userId}, {password: req.body.newPassword}, function(err, updateUser) {
					res.json({status: 0, message: '修改成功', data: updateUser});
				})
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/showUser', function(req, res, next) {
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
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				user.findAll(function(err, allUser) {
					res.json({status: 0, message: '获取成功', data: allUser});
				});
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/powerUpdate', function(req, res, next) {
	if (!req.body.userId) {
		res.json({status: 1, message: "用户id传递失败"});
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
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				user.update({_id: req.body.userId}, {userAdmin: true}, function(err, updateUser) {
					res.json({status: 0, message: '修改成功', data: updateUser});
				})
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/addArticle', function(req, res, next) {
	if (!req.body.token) {
		res.json({status: 1, message: "登录出错"});
		return;
	}
	if (!req.body.id) {
		res.json({status: 1, message: "用户传递错误"});
		return;
	}
	if (!req.body.articleTitle) {
		res.json({status: 1, message: "文字名称为空"});
		return;
	}
	if (!req.body.articleContext) {
		res.json({status: 1, message: "文字内容为空"});
		return;
	}
	var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				var saveArticle = new article({
					articleTitle: req.body.articleTitle,
					articleContext: req.body.articleContext,
					articleTime: Date.now()
				});
				saveArticle.save(function(err) {
					if (err) {
						res.json({status: 1, message: err});
					} else {
						res.json({status: 0, message: '保存成功'});
					}
				});
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/delArticle', function(req, res, next) {
	if (!req.body.articleId) {
		res.json({status: 1, message: "文章id传递失败"});
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
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				article.remove({_id: req.body.articleId}, function(err, delArticle) {
					res.json({status: 0, message: '删除成功', data: delArticle});
				})
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/addRecommend', function(req, res, next) {
	if (!req.body.token) {
		res.json({status: 1, message: "登录出错"});
		return;
	}
	if (!req.body.id) {
		res.json({status: 1, message: "用户传递错误"});
		return;
	}
	if (!req.body.recommendImg) {
		res.json({status: 1, message: "推荐图片为空"});
		return;
	}
	if (!req.body.recommendSrc) {
		res.json({status: 1, message: "推荐跳转地址为空"});
		return;
	}
	if (!req.body.recommendTitle) {
		res.json({status: 1, message: "推荐标题为空"});
		return;
	}
	var check = checkAdminPower(req.body.username, req.body.token, req.body.id);
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				var saveRecommend = new recommend({
					recommendImg: req.body.recommendImg,
					recommendSrc: req.body.recommendSrc,
					recommendTitle: req.body.recommendTitle
				});
				saveRecommend.save(function(err) {
					if (err) {
						res.json({status: 1, message: err});
					} else {
						res.json({status: 0, message: '保存成功'});
					}
				});
			} else {
				res.json({status: 1, message: "用户没有获得权限或者已经停用"});
			}
		})
	} else {
		res.json({status: 1, message: check.message});
	}
});

router.post('/delRecommend', function(req, res, next) {
	if (!req.body.recommendId) {
		res.json({status: 1, message: "评论id传递失败"});
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
	if(check.error == 0) {
		user.findByUsername(req.body.username, function(err, findUser) {
			if (findUser[0].userAdmin && !findUser[0].userStop) {
				recommend.remove({_id: req.body.recommendId}, function(err, delRecommend) {
					res.json({status: 0, message: '删除成功', data: delRecommend});
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