/*
*   网易对于rem布局的适配解决方案
*   判断window是否有orientationchange命令，没有的话使用resize
*   在获取客户端宽度设置fontsize，设置基准为15（可修改）
*   然后在doc和win上开启监听
* */
(function (doc,win) {
    var douEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function(){
            var clientWidth = douEl.clientWidth;
            if(!clientWidth) return;
            douEl.style.fontSize = 15 * (clientWidth/320) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc,false);
    doc.addEventListener('DOMContentLoaded',recalc,false);
})(document,window)