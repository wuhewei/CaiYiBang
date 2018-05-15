$(document).ready(function(){
	
	checkIsRememberMe();
	
	
	/* 表单提交 */
	$('form').ajaxForm({
		url: '/login',
		type: 'post',
		resetForm: 'false',
		dataType: 'json',
		timeout: 5000,
		beforeSubmit: function(formData, jqForm, options){
			try{
				validate(jqForm[0].username,[RQ, RANGE, "{2,16}"], "账号");
				validate(jqForm[0].password,[RQ, RANGE, "{4,32}"], "密码");
			}catch(err){
				danger(err);
				return false;
			}
		},
		success: function(data){
			if(data.code == 1){
				redirect('/');
			}
			rememberOrCancelMe();
		},
		error: function(err){
			danger('登录超时');
		}
	});
});
	
/* 记住账号  */
function rememberOrCancelMe(){
	if ($("#remember_me").prop("checked")) { 
		var username = $("input[name='username']").val(); 
		$.cookie("rmbUser", "true", { expires: 7 }); //存储一个带7天期限的cookie 
		$.cookie("username", username, { expires: 7 }); 
	}else{ 
		$.cookie("rmbUser", "false", { expire: -1 }); 
		$.cookie("username", "", { expires: -1 }); 
	}
}

/* 自动填充账号 */
function checkIsRememberMe(){
	if ($.cookie("rmbUser") == "true") { 
		$("#remember_me").prop("checked", true); 
		$("input[name='username'").val($.cookie("username")); 
	} 
}
