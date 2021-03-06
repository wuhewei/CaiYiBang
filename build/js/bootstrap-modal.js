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
		var modalSize = {
			width: 0,
			height: 0,
			top: 0,
			left: 0
		}
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
				modal.find('.modal-dialog').css({
					'position': "absolute",
					'left': ($(window).width() - opts.width) / 2,
					'top': ($(document).height() - opts.height) / 2,
					'z-index': 9999
				});
				//设置模态框样式
				$(".modal-body").css({
					 'height': opts.height - 115
				});
				$(".modal-header").css({
					'background-color': '#5180D6',
					'color': '#fff'
				})
				$(".modal-header").find("button").css({
					'background-color':'rgba(255,255,255,0.15)',
					'color':'#fff',
					'margin-left': '8px',
					'width': '22px',
					'text-align': 'center',
					'display': 'block',
					'outline': 'none'
				})
				//显示模态框
				modal.modal('show');
				//当窗口打开后
				modal.on('shown.bs.modal', function(){
					if(opts.openEvent){
//						eval(opts.openEvent);
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
				//记录模态框原先大小
				modalSize.width = opts.width;
				modalSize.height = opts.height;
				modalSize.left = ($(window).width() - opts.width) / 2;
				modalSize.top = ($(document).height() - opts.height) / 2;
				
				//当点击全屏按钮
				$('.fullscreen').click(function(){
					var state = $(this).attr('data-state')
					var d = modal.find('.modal-dialog');
					if(state == undefined){
						d.addClass('full-screen');
						d.css({
							'top': 0,
							'left': 0,
							'margin': -1,
							'width': '100%'
						});
						$(".modal-content").css({
							'width': $(window).innerWidth()+2 + "px",
							'height': $(window).innerHeight()+"px",
						});
						$(".modal-content .modal-body").css({
							'width': $(window).innerWidth()+2 + "px",
							'max-height': $(window).innerHeight()-(56+65)+"px",
						})
						$(".modal-body").css({
							'height': "100%",
						})
						$(this).attr('data-state','full');
					}else{
						d.removeClass('full-screen');
						$(this).removeAttr('data-state');
						modal.find('.modal-dialog').css({
							'top': modalSize.top,
							'left': modalSize.left,
							'margin': 'auto',
							'width': 'auto'
						});
						$(".modal-content").css({
							'width': modalSize.width + "px",
							'height': modalSize.height + "px"
						})
						$(".modal-content .modal-body").css({
							'width': modalSize.width + "px",
							'max-height': modalSize.height-(56+65) + "px"
						})
						$(".modal-body").css({
							'height': 'auto',
						})
					}
					$(window).on('resize',function(e){
						$(".full-screen .modal-content").css({
							'width': $(window).innerWidth()+2 + "px",
							'height': $(window).innerHeight()+"px",
						});
						$(".full-screen .modal-content .modal-body").css({
							'width': $(window).innerWidth()+2 + "px",
							'max-height': $(window).innerHeight()-(56+65)+"px",
						})
					});
				});
				//当窗口最大化
				$('.fullscreen').on()
			},
			dHtml: function(o){
				var html =
				'<div id="shade" style=" background-color: #000;bottom: 0;left: 0;position: fixed;right: 0;top: 0;transition: opacity 0.15s linear 0s;opacity: 0.5;">'+'</div>'
				+'<div id="' + o.id + '" class="modal fade" style=" overflow: hidden;">'
					+'	 <div class="modal-dialog" style="display:table-cell">'
					+'	 	<div class="modal-content" style="width:' + o.width + 'px;height:' + o.height + 'px;border-radius:0px; overflow:hidden;">'
					+'	 		<div class="modal-header">'
					+'	 			<button type="button" class="btn btn-xs pull-right" data-dismiss="modal">'
					+'	 				<i class="fa fa-remove"></i>'
					+'	 			</button>'
					+'	 			<button type="button" class="btn btn-xs pull-right fullscreen">'
					+'	 				<i class="fa fa-arrows-alt"></i>'
					+'	 			</button>'
					+'	 			<h4 id="myModalLabel" class="modal-title">' + o.title + '</h4>'
					+'	 		</div>'
					+'	 		<div class="modal-body" style="overflow:auto; max-height:'+(parseInt(o.height)-(56+65))+'px ;">'
					+'	 			<p>正在加载...</p>'
					+'	 		</div>'
					+'	 		<div class="modal-footer">'
					+'	 			<button class="btn" data-dismiss="modal" aria-hidden="true">取消</button>'
					+'	 			<button class="btn btn-primary ok" style="background-color:#5180D6;border:1px solid #5180D6;">确定</button>'
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


