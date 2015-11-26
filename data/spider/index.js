var Promise = require("bluebird");
var cp = require('child_process');
var exec = Promise.promisify(cp.exec);


//获取潜在分词
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


//针对cia初始化
exports.ciaSync = function(){
	exec('python ../data/spider/ciaSync.py',{
		maxBuffer: 5000 * 1024
	})
		.then(function(stdout){
			console.log(stdout);
		})
		.catch(function(e){
		    console.log(e);
    });
}