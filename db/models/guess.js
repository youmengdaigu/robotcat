"use strict";
module.exports = function(sequelize, DataTypes) {

	var time = today();
  	var Guess = sequelize.define("Guess", {
		preValue: {type:DataTypes.INTEGER,defaultValue:0},
		time: {type:DataTypes.STRING, defaultValue:time},
		trueValue : {type:DataTypes.INTEGER,defaultValue:0}
	});
  	return Guess;
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
