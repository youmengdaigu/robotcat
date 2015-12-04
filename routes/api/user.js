var express = require('express');
var User = require('../../db/models').User;
var router = express.Router();

//获取当前用户的总数
///////////////////////////////////////////////////
router.route('/users/totalNum')
	.get(function(req,res){
		User.count().then(function(c){
			res.json(c);
		}).catch(function(err){
			console.log(err);
		});
	});


//更新一个用户的信息
router.route('/users/:id')
	.post(function(req,res){
		var id = req.params.id;
		var rate = req.body.rate;
		User.findOne({where:{id:id}}).then(function(user){
			user.rate = rate;
			user.save().then(function(){
				res.send("正确率保存成功！");
			});
		});
	});


module.exports = router;