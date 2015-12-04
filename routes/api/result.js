var express = require('express');
var Result = require('../../db/models').Result;
var router = express.Router();


//将当天的预测保存到数据库中
///////////////////////////////////////////////////
router.route('/results')
	//获取所有有效的数据，用于模型训练
	.get(function(req,res){
		Result.findAll({order: 'id',where:{trueValue:{$ne:0},preValue:{$ne:0}}}).then(function(results){
			res.json(results);
		}).catch(function(err){
			console.log(err);
		});
	})
	.post(function(req,res){
		var time = req.body.time;
		var preValue = req.body.preValue;
		var trueValue = req.body.trueValue;
		Result.findOrCreate({where:{time:time},defaults:{preValue:preValue,time:time}})
		.spread(function(result){
			result.preValue = preValue;
			result.trueValue = trueValue;
			result.save();
		});
		res.send('更新成功！');
	});



//获取所有的用于训练的历史数据
router.route('/results/trainData')
	.get(function(req,res){
		Result.findAll({order: 'id',where:{trueValue:{$ne:0}}}).then(function(results){
			res.json(results);
		}).catch(function(err){
			console.log(err);
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
