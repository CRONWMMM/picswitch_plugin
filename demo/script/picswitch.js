/*!
 * picswitch
 * write by CRONWMMM 
 * [Imitation from Lokesh Dhakar's jQuery Lightbox plugin]
 *
 * More info:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * Copyright 2007, 2015 Lokesh Dhakar
 * Released under the MIT license
 * https://github.com/lokesh/lightbox2/blob/master/LICENSE
 */


/**
 * 在window全局上注册PicSwitch的实例 
 * @param  root为window对象
 * @param  $为jQuery对象
 */
;(function(root,$){

	var PicSwitch = (function(){
		function PicSwitch(options){
			this.album = [];							// album属性，用于存放所有相同组别的图片对象信息
			this.group = void 0;						// group属性，用于存放当前组名
			this.currentImageIndex = void 0;			// currentImageIndex属性，用于存放当前图片的索引
			this.canSwitch = false;						// canSwitch属性，用于控制是否可以执行图片切换
			// 调用init方法进行初始化
			this.init();

			// options用于初始化选项参数
			// 用户可以通过PicSwitch.option()方法修改参数
			// 如果用户不修改，默认使用PicSwitch默认属性defaults里提供的参数
			// 此处不直接用 PicSwitch.defaults ，而使用this.constructor是为了和函数名解耦----*
			this.options = $.extend({},this.constructor.defaults);
			this.option(options);
		}

		PicSwitch.prototype = {
			constructor : PicSwitch,

			// 初始化选项参数
			option : function(options){
				$.extend(true,this.options,options || {});
			},

			// 初始化函数
			init : function(){
				// 预先定义self变量来存储this值，防止后续的this漂移问题
				var self = this;
				// enable和build方法必须要等到DOM加载完成才能执行
				$(function(){
					self.build();
					self.enable();
				});
			},


			enable : function(){
				var self = this;
				$("body").on('click','a[data-picswitch]',function(e){
					e.stopPropagation();	// 阻止冒泡
					e.preventDefault();		// 阻止默认行为
					self.start($(this));
				});
			},


			// 构建渲染DOM文档
			// 缓存相应的jQuery对象
			build : function(){
				var self      = this,
					mask      = $('<div id="mask"></div>'),	// 遮罩层				
					picswitch = $('<div id="picswitch">' + 	// 图片弹框
										'<span class="pic-close"></span>' + 
										'<div class="pic-view">' + 
											'<span class="pic-btn pic-btn-prev"></span>' + 
											'<img src="" alt="">' + 
											'<span class="pic-btn pic-btn-next"></span>' + 
										'</div>' + 
										'<div class="pic-caption">' + 
											'<p class="pic-des">This is picture describtion.</p>' + 
											'<span class="pic-index">0 / 0</span>' + 
										'</div>' + 
									'</div>');
				// 将渲染好的DOM结构插入到文档中
				$(document.body).append(mask,picswitch);

				// 缓存相应的jQuery对象
				this.$mask      = $("#mask");							// 遮罩层对象
				this.$picswitch = $("#picswitch");						// 图片弹框对象
				this.$close     = $("#picswitch .pic-close");			// 关闭图标对象
				this.$view      = $("#picswitch .pic-view");			// 预览区对象
				this.$prevbtn   = $("#picswitch .pic-btn-prev");		// 向前切换按钮对象
				this.$nextbtn   = $("#picswitch .pic-btn-next");		// 向后切换按钮对象
				this.$img       = $("#picswitch img");					// 展示图片对象
				this.$caption   = $("#picswitch .pic-caption");			// 信息展示对象
				this.$des       = $("#picswitch .pic-des");				// 描述对象
				this.$index     = $("#picswitch .pic-index");			// Index对象

				this.containerPadding = {
					top    : parseInt(this.$picswitch.css('padding-top')),
					right  : parseInt(this.$picswitch.css('padding-right')),
					bottom : parseInt(this.$picswitch.css('padding-bottom')),
					left   : parseInt(this.$picswitch.css('padding-left'))
				};
				this.containerBorder = {
					top    : parseInt(this.$picswitch.css('border-top-width')),
					right  : parseInt(this.$picswitch.css('border-right-width')),
					bottom : parseInt(this.$picswitch.css('border-bottom-width')),
					left   : parseInt(this.$picswitch.css('border-left-width'))
				};
				
			},


			// 显示遮罩层和图片弹框
			// 如果是图像组就将图像组里的所有图片信息添加到相册数组中
			// @param  $this参数为当前点击的对象
			start : function($this){
				var self         = this,
					currentsrc   = $this.attr("href"),
					title        = $this.attr("title");
					currentgroup = $this.attr("data-picswitch");
				fillAlbum(currentgroup);
				getCurrentIndex(currentsrc);
				self.initPop(currentsrc);
				self._bindEvent();

				/**
				 * fillAlbum 函数用于获得图片集里所有图片信息，并保存到album中
				 * @param  groupName 参数为当前点击图片所在的图片组名
				 */
				function fillAlbum(groupName){
					if(self.group !== groupName){
						self.group = groupName;
						self.album = [];
						$("*[data-picswitch=" + groupName + "]").each(function(){
							self.album.push({
								src : $(this).find("img").attr("data-src"),
								des : $(this).attr("title")
							});
						});
					}
				}

				/**
				 * getCurrentIndex 函数用于获得当前点击图片的index索引
				 * @param  loadSrc 参数为当前点击图片的大图src
				 */
				function getCurrentIndex(loadSrc){
					for(var i=0;i<self.album.length;i++){
						if(self.album[i].src === loadSrc){
							self.currentImageIndex = i;
							break;
						}
					}
				}
			},


			/**
			 * initPop函数显示初始化弹框和遮罩
			 * @param  currentSrc 参数为当前点击的需要加载图片的src
			 */
			initPop : function(currentSrc){
				var self = this;
				self.$close.hide();
				self.$caption.hide();
				self.$mask.fadeIn(self.options.fadeDuration);
				self.$picswitch.fadeIn(self.options.fadeDuration);
				self.prevLoad(currentSrc);
			},


			/**
			 * prevLoad函数为预加载图片函数
			 * @param  loadSrc 参数为需要预加载的src
			 * 此函数可能存在性能损失
			 * 在window.resize的事件上调用此方法，重复创建了image对象并赋值
			 */
			prevLoad : function(loadSrc){
				var self = this,
					img  = new Image();
				// 关闭canSwitch控制器
				self.canSwitch = false;
				self.$img.css({width : "auto",height : "auto"}).hide();
				img.onload = function(){
					var currentIndex   = 0,							// 当前图片索引
						totalImages    = 0,							// 图片总数
						width          = 0,							// 图片最终的显示宽度
						height         = 0,							// 图片最终的显示高度
						imageHeight    = 0,							// 图片的原始高度
						imageWidth     = 0,							// 图片的原始宽度
						maxImageHeight = 0,							// 当前窗口允许图片显示的最大高度
						maxImageWidth  = 0,							// 当前窗口允许图片显示的最大宽度
						scale          = 0,							// 显示比率
						windowHeight   = $(window).height(),		// 当前视口高度
						windowWidth    = $(window).width();			// 当前视口宽度
					self.$img.attr("src",img.src);
					currentIndex   = self.currentImageIndex + 1;
					totalImages    = self.album.length;
					imageWidth     = self.$img.width();
					imageHeight    = self.$img.height();
					maxImageWidth  = parseInt(windowWidth - (self.containerPadding.left + self.containerPadding.right) - (self.containerBorder.left + self.containerBorder.right));
					maxImageHeight = parseInt(windowHeight - (self.containerPadding.top + self.containerPadding.bottom) - (self.containerBorder.top + self.containerBorder.bottom) - self.options.browserDistance);
					
					// 判断图片宽高是否大于用户允许显示的最大宽度
					// 如果任何一个超过最大值，就将最大尺寸/当前尺寸，比较得到最小值，如果二者相同就取值1，将这个比率赋值给scale
					// 显示尺寸就为缩小后的尺寸
					// 如果两个都在最大值范围内，就将原始图片显示出来
					if(imageWidth > maxImageWidth || imageHeight > maxImageHeight){
						scale  = Math.min(maxImageWidth/imageWidth,maxImageHeight/imageHeight,1);
						width  = parseInt(imageWidth*scale);
						height = parseInt(imageHeight*scale);
					}else{
						width  = imageWidth;
						height = imageHeight;
					}

					self.$picswitch.animate({
						width      : width,
						height     : height,
						marginLeft : -width/2,
						marginTop  : -height/2
					},self.options.deforDuration,function(){
						// 开启canSwitch控制器
						self.canSwitch = true;
						self.$img.css("width","100%").fadeIn(self.options.imageFadeDuration);
						self.$close.fadeIn(self.options.imageFadeDuration);
						// 显示图片介绍栏并更改其中内容
						self.$caption.fadeIn(self.options.imageFadeDuration)
									 .find(".pic-des")
									 .html(self.album[self.currentImageIndex].des);

						// 这边其实可以更完善，但是我懒得写了
						// 将设置图片索引格式的权限留给用户，调用self.options.albumLabel
						// 将其中数字用正则替换掉，其余保留用户设定的字符，如下
						// this.options.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
						self.$index.html(currentIndex + " / " + totalImages);
					});
				};

				// 注意：img.src的赋值操作需要放在onload之后
				img.src = loadSrc;
			},


			/**
			 * _bindEvent 函数为绑定事件函数
			 */
			_bindEvent : function(){
				var self = this;

				// 为上下切换按钮绑定hover和click事件
				self.$prevbtn.hover(function(){
					$(this).animate({"opacity" : 1},self.options.arrowFadeDuration);
				},function(){
					$(this).animate({"opacity" : 0},self.options.arrowFadeDuration);
				}).click(function(){
					// 只有canSwitch控制器开启状态才能切换，防止用户连续切换
					if(self.canSwitch){
						var prevSrc = self.album[--self.currentImageIndex].src;
						self._switchBtn();
						self.$close.hide();
						self.prevLoad(prevSrc);
					}
				});
				self.$nextbtn.hover(function(){
					$(this).animate({"opacity" : 1},self.options.arrowFadeDuration);
				},function(){
					$(this).animate({"opacity" : 0},self.options.arrowFadeDuration);
				}).click(function(){
					// 只有canSwitch控制器开启状态才能切换，防止用户连续切换
					if(self.canSwitch){
						var nextSrc = self.album[++self.currentImageIndex].src;
						self._switchBtn();
						self.$close.hide();
						self.prevLoad(nextSrc);
					}
				});
				self._switchBtn();


				// 为close绑定事件
				self.$close.click(function(){
					var array = [self.$prevbtn,self.$nextbtn,self.$close,self.$mask,$(window)];
					self.$picswitch.fadeOut(self.options.fadeDuration);
					self.$mask.fadeOut(self.options.fadeDuration);
					// 隐藏上下切换按钮,并且为所有事件解除绑定
					self.$prevbtn.hide();
					self.$nextbtn.hide();
					// 解绑所有绑定事件对象的所有事件
					self._unbindEvent(array);
				});

				// 为mask绑定事件
				self.$mask.click(function(){
					var array = [self.$prevbtn,self.$nextbtn,self.$close,self.$mask,$(window)];
					self.$picswitch.fadeOut(self.options.fadeDuration);
					self.$mask.fadeOut(self.options.fadeDuration);
					// 隐藏上下切换按钮,并且为所有事件解除绑定
					self.$prevbtn.hide();
					self.$nextbtn.hide();
					// 解绑所有绑定事件对象的所有事件
					self._unbindEvent(array);
				});

				// 为窗口调节绑定事件
				self.clear = void 0;
				$(window).resize(function(){
					if(self.clear) clearTimeout(self.clear);
					self.clear = setTimeout(function(){
						self.$close.hide();
						self.prevLoad(self.$img.attr("src"));
					},self.options.windowResizeInterval);
				});

				// 为窗口绑定keydown事件和Esc关闭事件
				$(window).keydown(function(e){
					// 阻止默认行为
					e.preventDefault();
					switch(e.keyCode){
						case 37:
							if(self.options.keyBoardControll && self.canSwitch && self.currentImageIndex > 0){
								var prevSrc = self.album[--self.currentImageIndex].src;
								self._switchBtn();
								self.$close.hide();
								self.prevLoad(prevSrc);
							}
							break; 
						case 39:
							if(self.options.keyBoardControll && self.canSwitch && self.currentImageIndex < self.album.length-1){
								var nextSrc = self.album[++self.currentImageIndex].src;
								self._switchBtn();
								self.$close.hide();
								self.prevLoad(nextSrc);
							}
							break;
						case 27:
							if(self.options.keyBoardControll){
								var array = [self.$prevbtn,self.$nextbtn,self.$close,self.$mask,$(window)];
								self.$picswitch.fadeOut(self.options.fadeDuration);
								self.$mask.fadeOut(self.options.fadeDuration);
								// 隐藏上下切换按钮,并且为所有事件解除绑定
								self.$prevbtn.hide();
								self.$nextbtn.hide();
								// 解绑所有绑定事件对象的所有事件
								self._unbindEvent(array);
							}
					}
				});
			},


			/**
			 * unbindEvent 函数为解绑事件函数
			 * @param  array 参数是一个用来存放需要解绑对象的数组
			 */
			_unbindEvent : function(array){
				var self = this;
				// 循环遍历数组中所有对象依次解绑
				for(var i=0;i<array.length;i++){
					array[i].unbind();
				}
			},


			/**
			 * _switchBtn 函数用于处理前后切换按钮的显示隐藏
			 */
			_switchBtn : function(){
				var self = this;
				if(self.album.length > 1){
					// 具体判断
					if(self.currentImageIndex > 0 && self.currentImageIndex < self.album.length - 1){
						self.$prevbtn.show().css("opacity",0);
						self.$nextbtn.show().css("opacity",0);
					}else if(self.currentImageIndex === self.album.length - 1){
						self.$prevbtn.show().css("opacity",0);
						self.$nextbtn.hide();
					}else if(self.currentImageIndex === 0){
						self.$nextbtn.show().css("opacity",0);
						self.$prevbtn.hide();
					}
				}
			}

		}


		PicSwitch.defaults = {
			albumLabel            : '0 / 0',							// 图片索引格式
			deforDuration         : 600,								// 图片弹框变形时间
			fadeDuration          : 600,								// 遮罩层和弹出框淡入淡出渐变时间
			imageFadeDuration     : 600,								// 图片淡入淡出渐变时间
			arrowFadeDuration     : 200,								// 前后切换按钮淡入淡出渐变时间
			browserDistance       : 100,								// 图片弹框距离屏幕上下底框的距离
			windowResizeInterval  : 500,								// 窗口大小调整事件执行间隔时间
			keyBoardControll	  : true								// 是否可以键盘控制，默认true
		};

		return PicSwitch;
	})();


	root.PicSwitch = new PicSwitch();
})(this,jQuery);

