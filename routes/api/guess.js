var express = require('express');
var Guess = require('../../db/models').Guess;
var router = express.Router();


//进行竞猜
///////////////////////////////////////////////////
router.route('/guesses')
	//获取所有的竞猜数据
	.get(function(req,res){
		Guess.findAll().then(function(guesses){
			res.json(guesses);
		}).catch(function(err){
			console.log(err);
		});
	})
	 //更新数据
	.post(function(req, res) {
		var UserId = req.body.UserId;
		var result = req.body.result;
		var time = req.body.time;
		console.log(result);
		Guess.findOrCreate({where:{UserId:UserId,time:time},defaults:{UserId:UserId,result:result,time:time}})
		.spread(function(guess){
			guess.result = result;
			guess.save();
		});
		res.send('竞猜成功');
	});


//用户自己竞猜
router.route('/guesses/me')
		 //进行竞猜
	.post(function(req, res) {
		var user = req.session.user;
		var result = req.body.result;
		var time = today();
		console.log(result);
		Guess.findOrCreate({where:{UserId:user.id,time:time},defaults:{UserId:user.id,result:result,time:time}})
		.spread(function(guess){
			guess.result = result;
			guess.save();
		});
		res.send('竞猜成功');
	});


//获取指定时间的竞猜数据
///////////////////////////////////////////////////
router.route('/guesses/:time')
	//获取指定时间的竞猜数据
	.get(function(req,res){
		var time = req.params.time;
		Guess.findAll({where:{time:time}}).then(function(result){
			res.json(result);
		});
	});


//获取今天的时间
function today(){
	var d = new Date();
	var year = d.getFullYear().toString();
	var month = (d.getMonth()+1).toString();
	var day = d.getDate().toString();
	var time = year+month+day;
	return time;
}


module.exports = router;
