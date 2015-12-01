var express = require('express');
var weixinCon = require('../config')["weixin"];
var crypto = require('crypto');
var weixin = require('../weixin');
var router = express.Router();

//微信端口的验证
///////////////////////////////////////////////////
router.route('/weixin/confirm')
	.get(function(req,res){
		var token = weixinCon["token"];
		var timestamp = req.query.timestamp;
		var nonce = req.query.nonce;
		var signature = req.query.signature;
		var echostr = req.query.echostr;
		var array = new Array(token,timestamp,nonce);
		array.sort().join("");
		var content = array[0]+array[1]+array[2];
		console.log(content);
		//加密
		var sha1Code = crypto.createHash('sha1');
		var code = sha1Code.update(content).digest("hex");
		if(code == signature){
			res.send(echostr);
		}else{
			return false;
		}
	});



//微信menu相关操作
///////////////////////////////////////////////////
//删除menu
router.route('/weixin/menu/delete')
	.get(function(req,res){
		weixin.deleteMenu(function(r){
			var result = JSON.parse(r);
			if (result["errcode"] === 0){
				res.send('菜单删除成功！');
			}else{
				res.send('菜单删除失败！');
			}
		})
	});
//更新menu
router.route('/weixin/menu/create')
	.get(function(req,res){
		weixin.createMenu(function(r){
			var result = JSON.parse(r);
			if (result["errcode"] === 0){
				res.send('菜单更新成功！');
			}else{
				res.send('菜单更新失败！');
			}
		})
	});


weixin.createMenu(function(r){
	console.log(r);
})
module.exports = router;
