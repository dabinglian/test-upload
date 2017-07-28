/**
 * Created by chenxiaowei on 2017/7/24.
 */
$(function(){
    var page = {
        $el: $(".common-box"),
        events: {
            "touchend .popup-box": "popup",
            "touchend .tips-box": "showTips",
            "touchend .loading-box": "showLoading"
        },
        bindEvents: function(){
            if(this.events){
                var events = this.events;
                for(var item in events){
                    var itemArr = item.replace(/\s/, "@").split("@"),
                        handler = this[events[item]];
                    handler && this.$el.on(itemArr[0], itemArr[1], $.proxy(handler, this));
                }
            }
        },
        init: function(){
            this.bindEvents();
        },
        popup: function(){
            bt.ui.popup.show({
                content: "content",
                title: "title"
            });
        },
        showTips: function(){
            bt.ui.tip.show("no", "出错了!");
        },
        showLoading: function(){
            bt.ui.loading.show("正在加载图片");
        }
    };
    page.init();
});