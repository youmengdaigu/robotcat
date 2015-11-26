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



module.exports = router;