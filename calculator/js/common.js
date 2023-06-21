
window.Mybry = {};

Mybry.transitionEnd  = function(dom,callback){
  
    if(!dom || typeof dom != 'object' ) return false;

    dom.addEventListener('transitionEnd',function(){
      
        callback && callback();
    });
    dom.addEventListener('webkitTransitionEnd',function(){
       
        callback && callback();
    });
};

Mybry.tap = function(dom,callback){
   
    if(!dom || typeof dom != 'object' ) return false;
    var startTime = 0,isMove = false;
    dom.addEventListener('touchstart',function(e){
        startTime = Date.now();
    });
    dom.addEventListener('touchmove',function(e){
        isMove = true;
    });
    dom.addEventListener('touchend',function(e){
        if((Date.now()-startTime) < 150 && !isMove){
            
            callback && callback(e);
        }
      
        startTime = 0,isMove = false;
    });
};

Mybry.wdb = {
 
    constant : {
        TABLE_NAME:"calc",     
        SEPARATE:"-"            
    },
    
    getId : function(){
        var id = 0;  
        var appDataKey = this.getKeyArray();
        var spearate = this.constant.SEPARATE;
        if(appDataKey.length>0){
            var indexArray = [];    
            for(var i=0; i<appDataKey.length; i++){
                indexArray.push(parseInt(appDataKey[i].split(spearate)[1]));
            }
            id = this._maxId(indexArray) + 1;
        }
        return id;
    },
    
    getItem : function(value){
        if(!value) return false;
        if(isNaN(value)){
            return localStorage.getItem(value);
        }else{
            var key = localStorage.key(parseInt(value));
            return localStorage.getItem(key);
        }
    },
    deleteItem : function(value){
        if(!value) return false;
        if(isNaN(value)){
            
            if(value === "*"){
                var appDataKey = this.getKeyArray();
                for(var i=0; i<appDataKey.length; i++){
                    localStorage.removeItem(appDataKey[i]);
                }
            }else{
                localStorage.removeItem(value);
            }
        }else{
            var key = localStorage.key(parseInt(value));
            localStorage.removeItem(key);
        }
        return true;
    },
    _maxId : function(array){
        if(!array) return false;
        if(!Array.isArray(array)) return false;
        array.sort(function(a,b){
            return a - b;
        });
        return array[array.length-1];
    },
    getKeyArray : function(){
        var localStorage = window.localStorage;
        var storageLen = localStorage.length;
        var spearate = this.constant.SEPARATE,
            tableName = this.constant.TABLE_NAME;
       
        var appDataKey = [];
        if(storageLen>0){
            var itemKey = "";
            for(var i=0; i<storageLen; i++){
               
                itemKey = localStorage.key(i);
               
                var flagIndex = itemKey.indexOf(spearate);
                if(flagIndex != -1 ){
                    var startWord = itemKey.split(spearate)[0];
                    if(startWord == tableName){
                        appDataKey.push(itemKey);
                    }
                }
            }
        }
        return appDataKey;
    }
};

Mybry.browser = {
    versions: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return { //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
