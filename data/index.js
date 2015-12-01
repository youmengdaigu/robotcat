// 所有关于数据的工作
var analyse = require("./analyse");
var spider = require("./spider");
var schedule = require('node-schedule');
var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];


// 所有关于数据的跑批工作
// =============================================================================
exports.schedule = function(){
	// 每天9点进行预测
	predict()
	//每秒更新沪深300的数据
	updateHS300()
}



// CIA数据初始化工作
// =============================================================================
exports.ciaSync = function(){
	spider.ciaSync()
}

function predict(){
	schedule.scheduleJob(config["predict"],function(){
		if(tradeTime(today())){
			analyse.predict();
		}
	});
}

function updateHS300(){
	schedule.scheduleJob(config["updateHS300"], function(){
		if(tradeTime(today())){
			spider.updateHS300();
		}
	});

}

//获取今天的时间
function today(){
	var d = new Date();
	var year = d.getFullYear().toString();
	var month = (d.getMonth()+1).toString();
	var day = d.getDate().toString();
	var time = year+month+day;
	return time;
}

//判断当天是否是交易时间
function tradeTime(time){
	var config = require("../config");
	var list = config["analyse"]["untradeTime"];
	if (list.indexOf(time)=== -1){
	return true;
	}else{
	return false;
	}
}


