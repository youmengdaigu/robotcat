"use strict";
module.exports = function(sequelize, DataTypes) {

	var time = today();
  	var Result = sequelize.define("Result", {
		preValue: {type:DataTypes.INTEGER,defaultValue:0},
		trueValue : {type:DataTypes.INTEGER,defaultValue:0},
		time: {type:DataTypes.STRING, defaultValue:time,unique:true},
	});
  	return Result;
};

//获取今天的时间
function today(){
	var d = new Date();
	var year = d.getFullYear().toString();
	var month = (d.getMonth()+1).toString();
	var day = d.getDate().toString();
	var time = year+month+day;
	return time;
}
