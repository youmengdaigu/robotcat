(function($){
  	$('#up').click(function(){
		var url = '/api/guesses/me'
		$.ajax({
	        url: url,
	        type: 'POST',
	        data: "result=1",
	        success: function(response) {
				alert(response);
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
	        data: "result=-1",
	        success: function(response) {
				alert(response);
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
				results.forEach(function(result,i){
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
							pointHighlightStroke : "rgba(151,187,205,1)",
							data : rate
						}
					]
				}
				var ctx = document.getElementById("canvas").getContext("2d");
				window.myLine = new Chart(ctx).Line(lineChartData, {
					responsive: true
				});
			}
		})
	}
})(jQuery); // end of jQuery name space





