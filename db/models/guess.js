"use strict";
module.exports = function(sequelize, DataTypes) {

	var time = today();
  	var Guess = sequelize.define("Guess", {
		result: DataTypes.INTEGER,
		time: {type:DataTypes.STRING, defaultValue:time}
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
