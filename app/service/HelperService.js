app.factory('HelperService', ['$rootScope','$q',function($rootScope,$q){
    
    var service = {
        
        test: function() {
            console.log('HelperService service..');
        },

        test: function() {
            console.log('HelperService service..');
        },


        putb64:function(pic){
              var pic = pic;
              var url = "http://upload-z2.qiniu.com/putb64/-1";   //非华东空间需要根据注意事项 1 修改上传域名
              var xhr = new XMLHttpRequest();
              xhr.onreadystatechange=function(){
                if (xhr.readyState==4){
                  document.getElementById("myDiv").innerHTML=xhr.responseText;
                }
              }
              xhr.open("POST", url, true);
              xhr.setRequestHeader("Content-Type", "application/octet-stream");
              xhr.setRequestHeader("Authorization", "UpToken  填写你从服务端获取的上传token");
              xhr.send(pic);
        },

    };

    return service;

}]);