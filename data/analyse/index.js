var Promise = require("bluebird");
var cp = require('child_process');
var exec = Promise.promisify(cp.exec);


//获取潜在分词
exports.predict = function(){
	exec('python ../data/analyse/BPnet.py',{
		maxBuffer: 5000 * 1024
	})
		.then(function(stdout){
			console.log(stdout);
		})
		.catch(function(e){
		    console.log(e);
    });
}
