var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var recommend = require('../models/recommend')
var movie = require('../models/movie')
var article = require('../models/article')
var user = require('../models/user')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mongooseTest', function(req, res, next) {
	mongoose.connect('mongodb://localhost/pets');
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		console.log('链接成功');
		
		var Cat = mongoose.model('Cat', {name: String});
		
		var tom = new Cat({name: 'Tom'});
		
		tom.save().then(() => console.log('success insert！'));
	});
	res.send('数据库连接测试');
});

router.get('/showIndex', function(req, res, next) {
	recommend.findAll(function(err, getRecommend) {
		res.json({status: 0, message: "获取推荐", data: getRecommend});
	})
});

router.get('/showRanking', function(req, res, next) {
	movie.find({movieMainPage: true}, function(err, getMovies) {
		res.json({status: 0, message: '获取主页', data: getMovies});
	})
});

router.get('/showArticle', function(req, res, next) {
	article.findAll(function(err, getArticles) {
		res.json({status: 0, message: "获取主页", data: getArticles});
	})
});

router.post('/articleDetail', function(req, res, next) {
	if(!req.body.article_id) {
		res.json({status: 1, message: "文章id出错"});
		return;
	}
	article.findByArticleId(req.body.article_id, function(err, getArticle) {
		res.json({status: 0, message: "获取成功", data: getArticle});
	})
});

router.post('/showUser', function(req, res, next) {
	if (!req.body.user_id) {
		res.json({status: 1, message: "用户状态错误"});
		return;
	}
	user.findById(req.body.user_id, function(err, getUser) {
		res.json({status: 0, message: "获取成功", data: getUser});
	})
});

module.exports = router;
