/**
 * Created by chenxiaowei on 2017/7/24.
 */
bt = {};
bt.ui = {};

String.prototype.template = function (data, regexp) {
    return this.replace(regexp || /\${([^{}]*)}/g, function (str, p1) {
        return (data[p1]!==undefined&&data[p1]!==null&&data[p1].toString())||"";});
};


//遮罩
function lockScreen(type, opacity) {
    $("#suoping").css({
        background: (typeof type === "undefined" || type != "white") ? "#000" : "#fff",
        opacity : opacity || "0.4",
        height : $(document).height()
    }).show();
}

if(!$(".dialogs-manager-Wpr").length)
    $("body").append("<div class='dialogs-manager-Wpr'></div><div id='suoping'></div>");

$("body").on("click", "#suoping", function(){
    if(!$("#_site_tip_loader").is(":visible")){
        for(var i = 0; i < allDialogs.length; i++){
            allDialogs[i].close();
        }
    }
});

bt.ui.lockScreen = lockScreen;

//加载中
var loadingGif = [
        '<div id="_site_tip_loader">',
            '<img src="./images/loading.gif" width="32" height="32">',
            '<p class="showTips">加载中...</p>',
        '</div>'
    ].join('');

$("body").append(loadingGif);
var $loader = $("#_site_tip_loader");
$loader.hide();

bt.ui.loading = {
    show: function(tips){
        (typeof tips !== "undefined") && ($("#_site_tip_loader").find(".showTips").text(tips));
        $loader.show();
    },
    close: function(){
        $loader.hide();
    }
};

//提示
var tipWpr = [
        '<div id="_site_tip">',
            '<div class="tip-wpr">',
                '<i class="tip-icon"></i>',
                '<p class="tip-txt"></p>',
            '</div>',
        '</div>'
    ].join('');

$("body").append(tipWpr);
var $tip = $(".tip-wpr");
var tipTimeCount;

bt.ui.tip = {
    show : function(type, content, timer){
        $tip.addClass("show");
        $tip.find(".tip-txt").text(content).end()
            .find(".tip-icon").removeClass("tip-yes tip-no")
            .addClass("tip-"+type);
        clearTimeout(tipTimeCount);
        tipTimeCount = setTimeout(function(){
            $tip.removeClass("show");
            tipTimeCount = null;
        }, timer || 2000);
    }
};

//弹出框
var popupWpr = [
        '<div class="popup-wpr" id="${id}">',
            '<div class="popup">',
                '<div class="head"><span class="title">${title}</span></div>',
                '<div class="body">${content}</div>',
            '</div>',
        '</div>'
    ].join('');

bt.ui.popup = {
    _count: 1,
    show: function(conf){
        conf.id = conf.id || "pop-up-" + this._count++;
        $("body").append(popupWpr.template(conf));
        var $target = $("#" + conf.id);
        $target.find(".popup").css({
            "transform": "translateY(0)",
            "-webkit-transform": "translateY(0)"
        });
        $target.on("touchstart", function(e){
            if(e.target.id == conf.id){
                $target.off().remove();
            }
        })
        return conf.id;
    },
    hide: function(id){
        $("#" + id).off().remove();
    }
};

