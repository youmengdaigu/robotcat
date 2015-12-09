var Promise = require("bluebird");
var cp = require('child_process');
var exec = Promise.promisify(cp.exec);


//更新HS300
exports.updateHS300 = function(){
	exec('python ../data/spider/index.py',{
		maxBuffer: 5000 * 1024
	})
		.then(function(stdout){
			console.log(stdout);
		})
		.catch(function(e){
		    console.log(e);
    });
}



//更新RANK
exports.updateRank= function(){
	exec('python ../data/spider/rank.py',{
		maxBuffer: 5000 * 1024
	})
		.then(function(stdout){
			console.log(stdout);
		})
		.catch(function(e){
		    console.log(e);
    });
}


//针对cia初始化
exports.ciaSync = function(){
	exec('python ../data/spider/ciasync.py',{
		maxBuffer: 5000 * 1024
	})
		.then(function(stdout){
			console.log(stdout);
		})
		.catch(function(e){
		    console.log(e);
    });
}