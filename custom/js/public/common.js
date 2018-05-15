$(document).ready(function(){
	
});
	
/* 错误提示函数 */
function danger(text){
	var icon = "<span class='glyphicon glyphicon-minus-sign'/>"
	$('.danger').css('margin', '0px');
	$('.danger').css('padding', '5px');
	$('.danger').addClass('alert alert-danger');
	$('.danger').html(icon + " " + text);
}
/* 重定向页面函数 */
function redirect(url){
	$(location).attr('href', url);
}

	
