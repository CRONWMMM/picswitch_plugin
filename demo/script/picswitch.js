;(function($){

	// 插件主体
	var PicSwitch = (function(){

		function PicSwitch(element,options){
			var self = this;
			this.settings  = $.extend(true,$.fn.PicSwitch.defaults,options || {});
			this.element   = element;		  				   // this.element属性默认为$(document.body)
			this.groupName = "";			  				   // 设置一个当前的图片组名
			this.groupInfo = [];			  				   // 设置一个groupInfo属性用于存放当前图片组别里所有图片的信息
			this.maskArea  = $('<div id="mask"></div>');	   // 创建遮罩层
			this.popupWin  = $('<div id="pic-popup"></div>');  // 创建弹出框

			// 渲染DOM
			this.renderDOM();

			this.picCloseArea   = this.popupWin.find(".pic-close");;			// 图片关闭按钮
			this.picViewArea    = this.popupWin.find(".pic-view");				// 图片预览区域
			this.picPrevBtn     = this.popupWin.find(".switch-prev-btn");		// 图片向前切换按钮
			this.picNextBtn     = this.popupWin.find(".switch-next-btn");		// 图片向后切换按钮
			this.picCaptionArea = this.popupWin.find(".pic-caption");			// 图片描述区域
			this.picCaption     = this.popupWin.find("p .pic-describtion")		// 图片描述文本
			this.picArea        = this.popupWin.find("img");					// 图片
			this.picIndexArea   = this.popupWin.find("span .pic-index");		// 图片索引

			// 为$(document.body)绑定事件委托
			this.element.delegate("*[data-role=picswitch]","click",function(e){
				// 阻止事件冒泡
				e.stopPropagation();
				// 获取图片数组信息
				self.getGroup();
				// 初始化弹出框
				self.initPopup($(this));
			});
		}

		PicSwitch.prototype = {

			// 获取图片数组信息
			getGroup : function(){
				var self = this;
				if($(this).attr("data-group") != self.groupName){
					// 清空存储图片容器this.groupInfo
					self.groupInfo.length = 0;	
					// 当前点击的图片所在组名赋值给self.groupName			
					self.groupName = $(this).attr("data-group");
					var picList= self.element.find("[data-group=" + self.groupName + "]");
					// 循环遍历和点击图片为一组的所有图片，将信息push到存贮数组中
					picList.each(function(){
						self.groupInfo.push({
							resource : $(this).attr("data-resource"),
							group    : $(this).attr("data-group"),
							id       : $(this).attr("data-id")
						});
					});
				}
			},

			// 渲染DOM结构
			renderDOM : function(){
				var self = this;
				// 将DOM结构渲染到页面
				var picPopUp = '<span class="pic-close"></span>' + 
								'<div class="pic-view">' + 
									'<span class="switch-btn switch-prev-btn switch-prev-btn-show"></span>' + 
									'<img src="images/1-1.jpg" width="100%" alt="1-1">' + 
									'<span class="switch-btn switch-next-btn switch-next-btn-show"></span>' + 
								'</div>' +
								'<div class="pic-caption">' + 
									'<p class="pic-describtion">此处为图片的描述部分</p>' + 
									'<span class="pic-index">1 / 3</span>' + 
								'</div>';
				self.popupWin.html(picPopUp);
				self.element.append(self.maskArea,self.popupWin);
			},

			/**
			 * 初始化弹框
			 * @param  {jQuery} currentObj [实例化的jquery对象]
			 * @return 如果没有参数传入就return
			 */
			initPopup : function(currentObj){
				var self = this;
				if(currentObj){
					var currentSrc = currentObj.attr("data-resource"),
						currentId  = currentObj.attr("data-id");
					self._showMaskAndPopup(currentSrc,currentId);
				}else{
					return;
				}
			},

			_showMaskAndPopup : function(currentSrc,currentId){
				var self      = this,
					winWidth  = $(window).width(),
					winHeight = $(window).height(),
					width     = winWidth/2,
					height    = winHeight/2;
				// 隐藏弹出框的图片区域和图片标题
				self.picArea.hide();
				self.picCloseArea.hide();
				self.picCaptionArea.hide();

				self.maskArea.fadeIn();
				self.picViewArea.css({
					width : width + 4,
					height : height + 4
				});
				self.popupWin.fadeIn().css({
					width      : width + 4,
					height     : height + 4,
					marginLeft : -(width + 4)/2,
					top        : -(height + 8)
				}).animate({
					top : (winHeight-(height + 4))/2
				},this.settings.speed,function(){
					self.loadPic(currentSrc);
				});
			},

			loadPic : function(currentSrc){
				var self = this;
				this.picArea.css({width:"auto",height:"auto"});
				// 预加载函数
				self.preLoadImg(currentSrc,function(){
					self.picArea.attr("src",currentSrc);
					console.log(self.picArea.attr);
					var picWidth  = self.picArea.width(),
						picHeight = self.picArea.height();
					// 调用过渡函数，设置弹窗的宽和高
					self.changeSize(picWidth,picHeight);
				});
			},

			preLoadImg : function(currentSrc,callback){
				var img  = new Image();
				if(!!window.ActiveXObject){
					img.onreadystatechange = function(){
						if(this.readyState == "complete") callback();
					};
				}else{
					img.onload = function(){
						callback();
					};
				}
				img.src = currentSrc;
			},

			changeSize : function(picWidth,picHeight){
				var self      = this,
					winWidth  = $(window).width(),
					winHeight = $(window).height(),
				// 过滤宽高,从图片宽高比例和当前浏览器视口的宽高比例中选取最小的那个
				    scale     = Math.min(winWidth/(picWidth + 4),winHeight/(picHeight + 4),1),
				    width     = picWidth * scale,
				    height    = picHeight * scale;
				    console.log();
				this.picViewArea.animate({
										width : width,
										height : height
				},this.settings.speed);
				this.popupWin.animate({
										width : width,
										height : height,
										marginLeft : -(width/2),
										top : (winHeight - height)/2
				},this.settings.speed,function(){
					self.picArea.css({
										width : width,
										height : height
					}).fadeIn();
					self.picCloseArea.fadeIn();
					self.picCaptionArea.fadeIn();
				});
			}

		};

		return PicSwitch;
	})();



	// 将PicSwitch插件挂在jQuery原型上
	$.fn.PicSwitch = function(options){
		return this.each(function(){
			var self     = $(this),
				instance = self.data("PicSwitch");
			if(instance === undefined){
				instance = new PicSwitch(self,options);
				self.data("PicSwitch",instance);
			}
		});
	};


	$.fn.PicSwitch.defaults = {
		speed : 400
	};


})(jQuery);