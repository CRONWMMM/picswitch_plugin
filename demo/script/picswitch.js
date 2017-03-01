;(function($){

	// 插件主题
	var PicSwitch = (function(){

		function PicSwitch(element,options){
			this.settings = $.extend(true,$.fn.PicSwitch.defaults,options || {});
			this.element  = element;
			this.init();
		}

		PicSwitch.prototype = {
			init : function(){}
		};

		return PicSwitch;
	})();



	// 将PicSwitch插件挂在jQuery原型上
	$.fn.PicSwitch = function(options){
		return this.each(function(){
			var self     = $(this),
				instance = new PicSwitch(self,options);
			self.data("PicSwitch",instance);
		});
	};


	$.fn.PicSwitch.defaults = {
		selectors : {
			parent : "#container"
		}
	};


})(jQuery);