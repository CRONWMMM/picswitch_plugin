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
			// 定义一个album属性
			// 用于存放所有相同组别的图片对象信息
			this.album = [];
			this.group = void 0;
			this.currentImageIndex = void 0;
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
			},


			// 显示遮罩层和图片弹框
			// 如果是图像组就将图像组里的所有图片信息添加到相册数组中
			// @param  $this参数为当前点击的对象
			start : function($this){
				var self  = this,
					currentgroup = $this.attr("data-picswitch");
				fillAlbum(currentgroup);
				initPop();
				

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
								src : $(this).find("img").attr("data-src")
							});
						});
					}
				}

				/**
				 * initPop 函数用于初始化图片弹窗
				 * @return {[type]} [description]
				 */
				function initPop(){

				}

			}
	

		}


		PicSwitch.defaults = {
			albumLabel        : '0 / 0',							// 图片索引
			fadeDuration      : 600,								// 淡入淡出渐变时间
			imageFadeDuration : 600,								// 图片淡入淡出渐变时间

		};

		return PicSwitch;
	})();


	root.PicSwitch = new PicSwitch();
})(this,jQuery);

