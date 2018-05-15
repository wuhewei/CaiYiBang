/**
 * 封装的Dialog插件，基于Bootstrap模态窗口的简单拓展
 * 作者：hww
 * 
 * 1、插件暂时只有两个按钮，取消和确定，暂不支持自定义按钮;
 * 
 * 2、只能使用html data-*方式定义，不支持js初始化时配置参数;
 * 
 * 3、宽度和高度建议不要使用百分比;
 * 
 * 4、注意这里回调函数必须是字符串格式，如okEvent："ok()" 	ok()：自定义的函数，切记要带();
 */
(function($) {
	$.fn.btModal = function(){
		var _default = {
			id: "modal",//弹框id
			title: "dialog",//弹窗标题
			width: "600",//弹框宽度，暂时不支持%
			height: "500",//弹框高度，暂时不支持%
			backdrop: false,//是否显示遮罩层
			keyboard: true,//是否开启esc键退出
			remote: "",//加载远程url
			html: "",//加载指定的html文本；remote/html二选一
			openEvent: null,//打开弹窗后回调函数
			closeEvent: null,//关闭弹窗后回调函数
			okEvent: null//单击确定按钮回调函数
		};
		//动态创建窗口
		var createDialog = {
			init: function(opts){
				var _self = this;
				//动态插入模态框
				$("body").append(_self.dHtml(opts));
				
				//得到模态框
				var modal = $("#" + opts.id);
				
				//初始化
				modal.modal({
					backdrop: opts.backdrop,
					keyborad: opts.keyboard
				});
				if(opts.remote){
					$(".modal-body").load(opts.remote);
				}else{
					//带<开头是html文本，否则是id或者是class
					if(opts.html.indexOf("<") == -1){
						opts.html = $(opts.html).html();
					}
					$(".modal-body").html(opts.html);
				}
				
				//窗口大小位置
				var h = modal.height() - modal.find(".modal-header").outerHeight - modal.find(".modal-footer").outerHeight() - 5;
//				modal.css({
//					'position': "absolute",
//					'left': ($(window).width() - opts.width) / 2,
//					'top': ($(document).height() - opts.height) / 2,
//					'z-index': 9999
//				});
				modal.find('.modal-dialog').css({
					'position': "absolute",
					'left': ($(window).width() - opts.width) / 2,
					'top': ($(document).height() - opts.height) / 2,
					'z-index': 9999
				})
				$(".modal-body").css({
					 height: opts.height - 115
				});
				//显示模态框
				modal.modal('show');
				
				//当窗口打开后
				modal.on('shown.bs.modal', function(){
					if(opts.openEvent){
						//eval(opts.openEvent);
					}
				});
				
				//当窗口关闭后
				modal.on('hide.bs.modal',function(){
					modal.remove();
					$('#shade').remove();
					if(opts.closeEvent){
						eval(opts.closeEvent);
					}
				});
				
				//当点击确定后
				$('.ok').click(function(){
					if(opts.okEvent){
						var ret = eval(opts.okEvent);
						if(ret){
							modal.modal('hide');
						}
					}
				});
				
			},
			dHtml: function(o){
				var html =
				'<div id="shade" style=" background-color: #000;bottom: 0;left: 0;position: fixed;right: 0;top: 0;transition: opacity 0.15s linear 0s;opacity: 0.5;">'+'</div>'
				+'<div id="' + o.id + '" class="modal fade">'
					+'	 <div class="modal-dialog" style="display:table-cell">'
					+'	 	<div class="modal-content" style="width:' + o.width + 'px;height:' + o.height + 'px;">'
					+'	 		<div class="modal-header">'
					+'	 			<button type="button" class="close" data-dismiss="modal" >'
					+'	 				<span aria-hidden="true">&times;</span>'
					+'	 				<span class="sr-only">Close</span>'
					+'	 			</button>'
					+'	 			<h4 id="myModalLabel" class="modal-title">' + o.title + '</h4>'
					+'	 		</div>'
					+'	 		<div class="modal-body" >'
					+'	 			<p>正在加载...</p>'
					+'	 		</div>'
					+'	 		<div class="modal-footer">'
					+'	 			<button class="btn" data-dismiss="modal" aria-hidden="true">取消</button>'
					+'	 			<button class="btn btn-primary ok">确定</button>'
					+'			</div>'
				 	+'		</div>'
			 		+'	</div>'
		 			+'</div>'
	 			;
	 			return html;
			}
		};
		
		return this.each(function(){
			$(this).click(function(){
				var opts = $.extend({}, _default, {
					id: $(this).attr("data-id"),
					title: $(this).attr("data-mtitle"),
					width: $(this).attr("data-width"),
					height: $(this).attr("data-height"),
					backdrop: $(this).attr("data-backdrop"),
					keyboard: $(this).attr("data-keyboard"),
					remote: $(this).attr("data-remote"),
					html: $(this).attr("data-html"),
					openEvent: $(this).attr("data-openEvent"),
					closeEvent: $(this).attr("data-closeEvent"),
					okEvent: $(this).attr("data-okEvent")
				});
				$(".modal").remove();
				createDialog.init(opts);
			})
		})
	}
	
})(jQuery);


