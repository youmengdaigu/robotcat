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
	var rule = new schedule.RecurrenceRule();
		//每天早上9点更新预测结果
	rule.hour = config['predict'];
	schedule.scheduleJob(rule,function(){
		analyse.predict();
	});
}

function updateHS300(){
	var rule = new schedule.RecurrenceRule();
	var times = [];
	for(var i=1; i<60; i++){
		times.push(i);
	}
	rule.minute = times;
	schedule.scheduleJob(rule, function(){
		spider.updateHS300();
	});

}