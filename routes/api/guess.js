var express = require('express');
var Guess = require('../../db/models').Guess;
var router = express.Router();


//进行竞猜
///////////////////////////////////////////////////
router.route('/guesses')
	//获取所有的竞猜数据
	.get(function(req,res){
		Guess.findAll().then(function(results){
			res.json(results);
		}).catch(function(err){
			console.log(err);
		});
	})
	//更新数据
	.post(function(req, res) {
		var UserId = req.body.UserId;
		var preValue = req.body.preValue;
		var trueValue = req.body.trueValue;
		var time = req.body.time;
		Guess.findOrCreate({where:{UserId:UserId,time:time},defaults:{UserId:UserId,preValue:preValue,trueValue:trueValue,time:time}})
		.spread(function(guess){
			guess.preValue = preValue;
			guess.trueValue = trueValue;
			guess.save();
		});
		res.send('历史数据导入完成！');
	});


//更新每天每个人的竞猜结果
router.route('/guesses/update')
	.post(function(req,res){
		var time = req.body.time;
		var trueValue = req.body.trueValue;
		Guess.findAll({where:{time:time}}).then(function(results){
			results.forEach(function(result){
				result.trueValue = trueValue;
				result.save();
			});
			res.send("个人数据更新完成!");
		});
	});


//用户自己竞猜已经获得所有数据
router.route('/guesses/me')
	.get(function(req,res){
		var user = req.session.user;
		Guess.findAll({where:{UserId:user.id,trueValue:{$ne:0},preValue:{$ne:0}}}).then(function(r){
			res.json(r);
		}).catch(function(e){
			console.log(e);
		});
	})
		 //进行竞猜
	.post(function(req, res) {
		var user = req.session.user;
		var preValue = req.body.preValue;
		var trueValue = req.body.trueValue;
		var time = today();
		Guess.findOrCreate({where:{UserId:user.id,time:time},defaults:{UserId:user.id,preValue:preValue,time:time}})
		.spread(function(guess){
			guess.preValue = preValue;
			guess.trueValue = trueValue;
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


//获取指定用户的竞猜数据
///////////////////////////////////////////////////
router.route('/user/:id/guesses')
	//获取指定时间的竞猜数据
	.get(function(req,res){
		var id = req.params.id;
		Guess.findAll({where:{UserId:id}}).then(function(results){
			res.json(results);
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
