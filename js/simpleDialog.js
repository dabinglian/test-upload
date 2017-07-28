/**
 * Created by chenxiaowei on 2017/7/24.
 */
var allDialogs = [];
function Dialog(conf){
    this.id = conf.id.replace("#", "");
    this.width = conf.width || '500';
    this.height = conf.height || '500';
    this.title = conf.title;
    this.content = conf.content || '';
    this.okFun = conf.okFun || function(){};
    this.cancelFun = conf.cancelFun || function(){};
    this.closeFun = conf.closeFun || function(){};
    allDialogs.push(this);
}
Dialog.prototype.init = function(){
    if(!this.$node().length){
        $(".dialogs-manager-Wpr").append('<div id="${id}"></div>'.template({id: this.id}));
    }
    this.render();
    this.setCss();
    this.$node().off()
        .on("click", ".header .close", $.proxy(this.close, this))
        .on("click", ".footer .cancel-btn", $.proxy(this.cancelClick, this))
        .on("click", ".footer .ok-btn", $.proxy(this.okClick, this))
};
Dialog.prototype.$node = function(str){
    if(str){
        return $("#"+this.id).find(str);
    }else{
        return $("#"+this.id);
    }
};
Dialog.prototype.setCss = function(){
    var self = this;
    this.$node().find(".dialog").css({
        width: self.width+"px",
        height: self.height+"px",
        "margin-top": -self.height/2 + "px",
        "margin-left": -self.width/2 + "px"
    });
    this.$node().find(".dialog .body").css({
        height: (self.height-130)+"px"
    });
};
Dialog.prototype.render = function(){
    var self = this;
    var dialogTpl = [
        '<div class="dialog" id="${id}"><div class="dialog-wpr">',
        '<div class="header clearfix">',
        '<p class="left">${title}</p>',
        '<a href="javascript:;" class="close sprite icon-del"></a>',
        '</div>',
        '<div class="body">${content}</div>',
        '<div class="footer">',
        '<a class="btn ok-btn" href="javascript:;">确定</a>',
        '<a class="btn cancel-btn ml-20" href="javascript:;">取消</a>',
        '</div>',
        '</div></div>'
    ].join("");
    this.$node().html(dialogTpl.template({
        id : self.id,
        title: self.title,
        content: self.content
    }));
};
Dialog.prototype.cancelClick = function(e){
    var $this = $(e.target),
        id = $this.closest(".dialog").attr("id");
    if(id == this.id){
        this.cancelFun(this, e);
        //this.trigger("dialog:cancelClick");
        this.close(e);
    }
};
Dialog.prototype.okClick = function(e){
    var $this = $(e.target),
        id = $this.closest(".dialog").attr("id");
    if(id == this.id){
        this.okFun(this, e);
        //this.trigger("dialog:okClick");
    }
};
Dialog.prototype.show = function(){
    //this.trigger("dialog:show");
    lockScreen();
    $("#"+this.id).find(".dialog").show();
    return;
};
Dialog.prototype.close = function(e){
    if(e){
        var $this = $(e.target),
            id = $this.closest(".dialog").attr("id");
        if(id == this.id){
            this.closeFun(this, e);
            //this.trigger("dialog:close");
            $("#"+this.id).find(".dialog").hide();
            lockScreen(false);
        }
    }else{
        $("#"+this.id).find(".dialog").hide();
        lockScreen(false);
    }
};