/**
 * Created by chenxiaowei on 2017/7/24.
 */
$(function(){
    var page = {
        $el: $(".photo-demo"),
        events: {
            "change #upload": "getFile",
            "touchend .del-btn": "doPhoto",
            "touchend .sure-btn": "upload"
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
        getFile: function(e){
            var self = this;
            var $this = $(e.currentTarget);
            var file = $this[0].files[0];
            if(!file) return false;
            if(this.validate(file)){
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadstart = function () {
                    bt.ui.loading.show();
                };

                reader.onload = function (e) {
                    $(".photo-box").hide();
                    $(".show-photo").show();

                    $("#show-img").attr("src", this.result);
                    self.clipImg($("#show-img"));
                }
            }
        },
        validate: function(file){
            var reg = /(\.|\/)(gif|jpe?g|png)$/i;
            if(!file.type.match(reg)){
                alert("图片格式不匹配");
                return false;
            }else if(file.size > 500000000){
                alert("图片尺寸太大");
                return false;
            }else{
                return true;
            }
        },
        clipImg: function($image){
            $image.cropper("destroy");

            var options = {
                aspectRatio: 16/9,  //设置剪裁框的长宽比
                autoCropArea: 1,    //自动剪裁的区域大小（百分比），介于 0 到 1 之间的数字。
                viewMode: 1,    //这个属性去掉之后可以随意移动图片
                dragMode: 'move',
                modal: false,
                background: false,
                minContainerWidth: 320,
                minContainerHeight: 180,
                restore: false,
                guides: false,   //剪裁框显示虚线
                highlight: true, //在剪裁框上面显示白色的模态框（高亮剪裁框）
                cropBoxMovable: false,
                cropBoxResizable: false,
                built: function(){
                    $(".handle-btns").show();
                }
            };
            $image.on({
                'zoom.cropper': function (e) {
                    var containerData = $image.cropper('getContainerData');
                    var imageData = $image.cropper('getImageData');
                    var ratio = e.ratio - e.oldRatio;

                    //放大的情况，不能放大到超过图片原来的宽度
                    if(imageData.width*(1+ratio) >= imageData.naturalWidth*2){
                        e.preventDefault();
                    }
                }
            }).cropper(options);
            bt.ui.loading.close();
        },
        doPhoto: function(){
            $(".photo-box").show();
            $(".show-photo").hide();
        },
        upload: function(){
            var $image = $('#show-img');
            var getCroppedCanvas = $image.cropper("getCroppedCanvas");

            //测试，用来看图片剪切后的展示效果
            var newImg = document.createElement("img");
            newImg.src = getCroppedCanvas.toDataURL("image/jpeg");
            $(".preview-img").html(newImg);

            ////canvas绘制图片加边框
            //this.renderCanvas(newImg, function(formData){
            //    $.ajax('/upload/image.json', {
            //        method: "POST",
            //        data: formData,
            //        processData: false,
            //        contentType: false,
            //        success: function (data) {
            //            console.log('Upload success');
            //        },
            //        error: function () {
            //            console.log('Upload error');
            //        }
            //    });
            //});
        }
    };
    page.init();
});