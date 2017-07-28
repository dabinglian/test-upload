/**
 * Created by chenxiaowei on 2017/7/24.
 */
$(function(){
    var page = {
        $el: $(".test-demo"),
        events: {
            "touchmove .swiper-slide": "sideBarTouchMove",
            "touchend .sure-btn": "doUpload",
            "touchend .frame .swiper-slide": "selectFrame"
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
            //this.uploadImg();
            //this.clipImg();
            this.initSwiper();
            this.doPhoto();
            this.isMove = false;
        },
        selectFrame: function(e){
            var self = this;
            e.stopPropagation();
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
        },
        doPhoto: function(){
            var self = this;
            this.$el.find('#upload').fileupload({
                url : '/upload/image.json',
                dataType : 'json',
                autoUpload : false,
                acceptFileTypes : /(\.|\/)(gif|jpe?g|png)$/i,
                maxFileSize : 500000000, // 500 MB
                maxNumberOfFiles : 1,
                add: function (e, data) {
                    if(self.checkType(data)){
                        console.log()
                        var $target = self.$el.find(".show-photo");
                        self.loadImg(data.files, $target, [self.clipImg], data.submit);
                        //self.clipImg();
                        //data.submit();
                        //self.$el.find(".uploadprogress").html('uploading...');
                    }else{
                        alert("文件类型不是图片");
                    }
                    console.log(this.files)
                },
                progressall : function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    self.$el.find('.uploadprogress').html("上传进度:" + progress + "%");
                    if (progress == 100) {
                        $('.uploadprogress').html("");
                    }
                },
                done : function(e, data) {
                    console.log(data)
                },
                success:function(result){
                    if(result.code == 0){
                        var $node = self.$el.find("#photo-img");
                        self.loadImg(this.files, $node);
                        self.clipImg($node);
                        //self.loadImg(this.files);
                        //self.$el.find(".showImage").html('');
                        //self.$el.find("#deletepic").show();
                    }
                },
                fail : function(e, result) {
                    console.log("fail")
                }
            });
        },
        doUpload: function(){
            var $image = $('#show-img');
            var getCroppedCanvas = $image.cropper("getCroppedCanvas", {width: 200, height:200});
            var newImg = document.createElement("img");
            newImg.src = getCroppedCanvas.toDataURL("image/jpeg");
            $(".show-img").html(newImg);

            var frameCanvas = document.getElementById('frame-canvas');
            var frameContext = frameCanvas.getContext('2d');

            //离屏canvas
            var offCanvas = document.getElementById('off-canvas');
            var offContext = offCanvas.getContext('2d');
            offCanvas.width = frameCanvas.width;
            offCanvas.height = frameCanvas.height;

            var key = $(".frame .swiper-slide.active p").data("key");
            var newframe = new Image();
            newframe.src = './images/'+key+'.png';

            newImg.onload = function(){
                newframe.onload = function(){
                    frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
                    frameContext.drawImage(newImg, 0, 0, frameCanvas.width, frameCanvas.height);
                    offContext.clearRect(0, 0, offCanvas.wdith, offCanvas.height);
                    offContext.drawImage(newframe, 0, 0, offCanvas.width, offCanvas.height);
                    frameContext.drawImage(offCanvas, 0, 0, frameCanvas.width, frameCanvas.height);

                    frameCanvas.toBlob && frameCanvas.toBlob(function(blob) {
                        var formData = new FormData();

                        formData.append('file', blob);

                        $.ajax('/action/upload/image.json', {
                            method: "POST",
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (data) {
                                console.log('Upload success');
                            },
                            error: function () {
                                console.log('Upload error');
                            }
                        });

                        var img = document.createElement("img"),
                            url = URL.createObjectURL(blob);

                        img.src = url;
                        $(".show-frame").html(img);
                    });
                }
            };

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
        loadImg: function(files, $target, callbacks, next){
            var file =files[0];
            var reader = new FileReader();
            var imgFile;

            reader.onload = function(e) {
                imgFile = e.target.result;
                $target.find("#show-img").attr('src', imgFile);
                if(callbacks && callbacks.length){
                    callbacks.forEach(function(cb){
                        cb($target, next);
                    });
                }
            };

            reader.readAsDataURL(file);
        },
        uploadImg: function(){
            var self = this;
            $('#uploadcard').fileupload({
                url : '/action/upload/image.json',
                dataType : 'json',
                autoUpload : false,
                acceptFileTypes : /(\.|\/)(gif|jpe?g|png)$/i,
                maxFileSize : 500000000, // 500 MB
                maxNumberOfFiles : 1,
                add: function (e, data) {
                    if(self.checkType(data)){
                        data.submit();
                        $(".showImage").html('uploading...');
                    }else{
                        alert("文件类型不是图片");
                    }
                },
                progressall : function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('.uploadprogress').html("上传进度:" + progress + "%");
                    //if (progress == 100) {
                    //    $('.uploadprogress').html("上传成功");
                    //}
                },
                done : function(e, data) {
                    console.log(data)
                },
                success:function(result){
                    if(result.code == 0){
                        var $node = self.$el.find("#photo-img");
                        self.loadImg(this.files);
                        $(".showImage").html('');
                        $("#deletepic").show();
                    }
                },
                fail : function(e, result) {
                    console.log("fail")
                }
            });
        },
        checkType: function(data){
            var value = data.files[0].name;
            if(!value.match(/(\.|\/)(gif|jpe?g|png)$/i)){
                return false;
            }else{
                return true;
            }
        },
        clipImg: function($target, next){
            var self = this;
            var $image = $target.find('#show-img');
            $image.cropper("destroy");

            var options = {
                aspectRatio: 1,  //设置剪裁框的长宽比
                autoCropArea: 1,    //自动剪裁的区域大小（百分比），介于 0 到 1 之间的数字。
                viewMode: 1,    //这个属性去掉之后可以随意移动图片
                dragMode: 'move',
                restore: false,
                guides: false,
                highlight: false,
                cropBoxMovable: false,
                cropBoxResizable: false,
                built: function(){
                    $(".sure-btn").on("touchend", function(next){
                        self.doUpload(next);
                    });
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


        }
    };
    page.init();
});