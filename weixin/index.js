var request = require('request-promise');
var Promise = require("bluebird");
var redis = require("redis");
var schedule = require('node-schedule');
var weixinCon = require("../config")["weixin"];
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
var c = redis.createClient();
//连接redis服务器
c.on("error", function (err) {
    console.log("Error " + err);
});

// 所有关于数据的跑批工作
// =============================================================================
exports.schedule = function(){
	schedule.scheduleJob(weixinCon["getToken"], function(){
		getToken(weixinCon["appID"],weixinCon["appsecret"]);
	});
}



//用户管理
// =============================================================================
//获根据openID取用户基本信息（UnionID）
exports.getUserInfo = function(openId,callback){
	c.getAsync("access_token").then(function(access_token){
		var url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token+"&openid="+openId+"&lang=zh_CN"
		request(url).then(function(response){
			callback(response);
		});
	});
}






// 自定义菜单管理
// =============================================================================
//删除menu
exports.deleteMenu = function(callback){
	c.getAsync("access_token").then(function(access_token){
		var url = 'https://api.weixin.qq.com/cgi-bin/menu/delete?access_token='+access_token;
		request(url).then(function(response){
			callback(response);
		});
	});
}
//添加menu
exports.createMenu = function(callback){

	c.getAsync("access_token").then(function(access_token){
		var option ={
			method:'POST',
			url :'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='+access_token,
			body: {
			     "button":[
			    {
					"type":"view",
					"name":"猜涨跌",
					"url":"http://123.57.138.73:1111"},
			    {
			    	"type":"view",
					"name":"琅琊榜",
					"url":"http://123.57.138.73:1111"},
				{
		    	"type":"view",
				"name":"我的主页",
				"url":"http://123.57.138.73:1111"}]
			},
			json: true
		};
		request(option).then(function(response){
			callback(response);
		});
	});
}

// 所有关于数据的跑批工作
// =============================================================================
//获取token
function getToken(appID,appsecret){
	var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appID+"&secret="+appsecret;
	request(url).then(function(response){
		var res = JSON.parse(response);
		//将获取到得token存储到数据库中
		c.setAsync("access_token",res.access_token).then(function(){
			console.log("token保存成功");
		});
	})
}
