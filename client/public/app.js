$(document).ready(function(){

	setInterval(function(){
		$.ajax({
			method: 'GET',
			url: '/stuff'
		}).then(function(res){
			var ls = 0;
			var cd = 0;
			var pwd = 0;
			res.forEach((record) => {
				ls += record.ls;
				cd += record.cd;
				pwd += record.pwd;
			})
			$("#ls").text(ls);
			$("#cd").text(cd);
			$("#pwd").text(pwd);
		})
	}, 1000);

});