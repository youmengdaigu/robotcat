(function($){
  	$('#up').click(function(){
		var url = '/api/guesses/me'
		$.ajax({
	        url: url,
	        type: 'POST',
	        data: "preValue=1",
	        success: function(response) {
				Materialize.toast(response, 1000);
	        },
	        error: function(){
	        	alert('竞猜失败');
	       	}
	    });
	});
	$('#down').click(function(){
		var url = '/api/guesses/me'
		$.ajax({
	        url: url,
	        type: 'POST',
	        data: "preValue=-1",
	        success: function(response) {
				Materialize.toast(response, 1000);
	        },
	        error: function(){
	        	alert('更新失败');
	       	}
	    });
	});
	window.onload = function(){
		var r = '/api/results'
		$.ajax({
			url:r,
			type:'GET',
			success:function(results){
				var timeSet = [];
				var rate = [];
				var correct = 0;
				var length = results.length
				results.forEach(function(result,i){
					var html = "<li class='row collection-item'><div class='col s4'>"+results[length-i-1]['time']+
					"</div><div class='col s4 center'>"+toStr(results[length-i-1]['trueValue'])+"</div><div class='col s4 center'>"+
					toStr(results[length-i-1]['preValue'])+"</div></li>";

					$("#history").append(html);
					if (result['preValue'] === result['trueValue']){
						correct++;
						rate.push((correct/(i+1)).toFixed(3));
					}else{
						rate.push((correct/(i+1)).toFixed(3));
					}
					timeSet.push(result['time'].substr(4));
				})
				var lineChartData = {
					labels :timeSet,
					datasets : [
						{
							label: "猜涨跌结果",
							fillColor : "rgba(151,187,205,0.2)",
							strokeColor : "rgba(151,187,205,1)",
							pointColor : "rgba(151,187,205,1)",
							pointStrokeColor : "#fff",
							pointHighlightFill : "#fff",
							pointHighlightStroke : "#fff",
							data : rate
						}
					]
				}
				var ctx = document.getElementById("canvas").getContext("2d");
				window.myLine = new Chart(ctx).Line(lineChartData, {
					responsive: true,
					scaleFontColor : "#fff",
					scaleShowGridLines : false,
					scaleShowLabels : true
				});
				function toStr(value){
				  if (value>0){
				      return '涨';
				    }else if (value<0){
				      return '跌';
				    }else{
				      return '无';
				  }
				}
			}
		})
	}
})(jQuery); // end of jQuery name space





