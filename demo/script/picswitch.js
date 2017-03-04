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
					self.enable();
					self.build();
				});
			},


			enable : function(){
				var self = this;
				alert($("img").length);
			},


			build : function(){
				var self = this;
				alert($("#container").length);
			}
		}


		PicSwitch.defaults = {
			albumLabel        : '0 / 0',							// 图片索引
			fadeDuration      : 600,								// 淡入淡出渐变时间
			imageFadeDuration : 600									// 图片淡入淡出渐变时间
		};

		return PicSwitch;
	})();


	root.PicSwitch = new PicSwitch();
})(this,jQuery);

