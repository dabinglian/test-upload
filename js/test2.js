/**
 * Created by chenxiaowei on 2017/7/24.
 */
$(function(){
    var page = {
        $el: $(".test-demo"),
        events: {
            "change #upload": "getFile",
            "touchmove .swiper-slide": "sideBarTouchMove",
            "touchend .frame .swiper-slide": "selectFrame",
            "touchend .sure-btn": "doUpload",
            "touchend .del-btn": "backToPhoto"
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
            this.initSwiper();
            this.isMove = false;
        },
        selectFrame: function(e){
            var self = this;
            if(self.isMove === false){
                var $this = $(e.currentTarget);
                $this.siblings().removeClass("active");
                $this.addClass("active");
                var key = $this.find("p").data("key");
                var url = './images/'+key+'.png';
                $(".cropper-crop-box .cropper-move").css({
                    "opacity": 1,
                    "background": "url("+url+") no-repeat 0 0",
                    "background-size": "100% 100%"
                })
            }
            self.isMove = false;
            return false;
        },
        goToClip: function(){
            $(".photo-box").hide();
            $(".show-photo").show();
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
                    // 读取前的一些操作，比如可以增加遮罩一类的
                };

                reader.onload = function (e) {
                    $("#show-img").attr("src", this.result);
                    self.goToClip();
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
        sideBarTouchMove: function(){
            this.isMove = true;
        },
        initSwiper: function(){
            var swiper = new Swiper('.frame .swiper-container',{
                touchMoveStopPropagation: false,
                slidesPerView: 'auto',
                freeMode: true
            });
        },
        clipImg: function($image){
            $image.cropper("destroy");

            var options = {
                aspectRatio: 1,  //设置剪裁框的长宽比
                autoCropArea: 1,    //自动剪裁的区域大小（百分比），介于 0 到 1 之间的数字。
                viewMode: 3,    //这个属性去掉之后可以随意移动图片
                dragMode: 'move',
                modal: false,
                minContainerWidth: 300,
                minContainerHeight: 300,
                restore: false,
                guides: false,
                highlight: false,
                cropBoxMovable: false,
                cropBoxResizable: false,
                built: function(){
                    $(".frame").show();
                    $(".frame").find("p").eq(0).trigger("touchend");
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
        backToPhoto: function(){
            $(".photo-box").show();
            $(".show-photo").hide();
        },
        renderCanvas: function(newImg, next){
            var frameCanvas = document.getElementById('frame-canvas');
            var frameContext = frameCanvas.getContext('2d');

            //离屏canvas
            var offCanvas = document.getElementById('off-canvas');
            var offContext = offCanvas.getContext('2d');
            offCanvas.width = frameCanvas.width;
            offCanvas.height = frameCanvas.height;

            var key = $(".frame .swiper-slide.active p").data("key");
            var newFrame = new Image();
            newFrame.src = './images/'+key+'.png';

            newImg.onload = function(){
                newFrame.onload = function(){
                    frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
                    frameContext.drawImage(newImg, 0, 0, frameCanvas.width, frameCanvas.height);
                    offContext.clearRect(0, 0, offCanvas.width, offCanvas.height);
                    offContext.drawImage(newFrame, 0, 0, offCanvas.width, offCanvas.height);
                    frameContext.drawImage(offCanvas, 0, 0, frameCanvas.width, frameCanvas.height);

                    frameCanvas.toBlob && frameCanvas.toBlob(function(blob) {
                        var formData = new FormData();

                        formData.append('file', blob);

                        next(formData);

                        var img = document.createElement("img"),
                            url = URL.createObjectURL(blob);

                        img.src = url;
                        $(".show-frame").html(img);
                    });
                }
            };
        },
        doUpload: function(){
            var $image = $('#show-img');
            var getCroppedCanvas = $image.cropper("getCroppedCanvas");

            //测试，用来看图片剪切后的展示效果
            var newImg = document.createElement("img");
            newImg.src = getCroppedCanvas.toDataURL("image/jpeg");
            $(".show-img").html(newImg);

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