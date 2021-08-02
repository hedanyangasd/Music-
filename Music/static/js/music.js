 var global = null, // 祖先元素
     audio = null, // audio对象
     loopType = 2, // 1->单曲循环， 2->列表循环  3->随机播放    循环类型
     json = null;

 var curTrack = null, // 当前歌曲的json数据
     prvTrack = null, // 上一条曲目的json
     nxtTrack = null; // 下一条曲目的json


 var mlist = '.play-form .form-tab ul.mtab',
     numMusic = '.play-ctrl a.icon-list';

 function ajax(methods, url, data, fn) {
     url = "http://127.0.0.1:3000" + url;
     var xhr = new XMLHttpRequest();
     xhr.open(methods, url, true);
     // 添加http头，发送信息至服务器时内容编码类型
     xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
     xhr.onreadystatechange = function () {
         if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
             let data = JSON.parse(xhr.responseText);
             fn(data);
         }
     };
     // 发送post
     xhr.send(data);
 }

 function hhhh() {
     var self = this;
     this.global = $('.fix-bottom'); // 初始化global播放器全局对象
     this.audio = $('audio')[0];
     this.audio.volume = $('.play-ctrl .cbar .cur').height() / 100; //音量调节
     bind(); // 启动事件监听器
 }

 $('audio').on('timeupdate', function () {
     setInterval(() => {
         window.sessionStorage.setItem('musicTime', this.currentTime);
     }, 2000)

 })


 function init(mid) {
     ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
         $('audio')[0].src = data.src;
         window.sessionStorage.setItem('music', data.src);
         $('audio')[0].play();
     })
 };


 // 事件绑定
 function bind() {
     var self = this,
         isLock = false,
         timeout = null;
     if (window.sessionStorage.getItem('isLock') == 'true') {
         isLock = true;
     }



     /********  锁定播放条  **********/
     $('body').on('click', function () {
         $('.play-ctrl .cbar').hide();
     }).on({
         mouseover: function () {
             if (!isLock) {
                 timeout && clearTimeout(timeout);
                 timeout = setTimeout(function () {
                     $('.fix-play').show(200);
                 }, 100);

             }
         },
         mouseleave: function () {
             if (!isLock) {
                 timeout && clearTimeout(timeout);
                 timeout = setTimeout(function () {
                     $('.fix-play').hide(500);
                     $('.play-form').css('display', 'none');
                 }, 800);
             }
         }
     }, '.fix-bottom');



     $(this.global).on('click', '.fix-lock a', function () {


         if (!isLock) {
             $(this).attr('class', 'lock');
             window.sessionStorage.setItem('isLock', true)
             isLock = true;
         } else {
             $(this).attr('class', 'unlock');
             window.sessionStorage.setItem('isLock', false)
             isLock = false;
         }

     }).on('click', '.play-btns a#data-ps', function () { //暂停/播放

         if (self.audio.src === '') {
             self.prvTrack = self.curTrack = 0;
             self.audio.src = self.json[0].src;
             self.audio.play();

         } else {
             self.audio.paused ? self.audio.play() : self.audio.pause();
         }

     }).on('click', '.play-btns a.prv', function () {

         var i = 0,
             objList = $('.form-tab ul li'),
             length = objList.length;

         for (; i < length; i++) {
             if ($('.form-tab ul li .abs-stus').eq(i).css('display') === 'block') {
                 break;
             }
         }
         if (i === 0) {
             i = length - 1;
         } else {
             i--;
         }

         self.loopType === 3 && (i = ~~(Math.random() * length)); // 若需要随机播放
         init(objList.eq(i).attr('data-id'));

     }).on('click', '.play-btns a.nxt', function () { 
         var i = 0,
             objList = $('.form-tab ul li'),
             length = objList.length;

         for (; i < length; i++) {
             if ($('.form-tab ul li .abs-stus').eq(i).css('display') === 'block') {
                 i++;
                 break;
             }
         }

         self.loopType === 3 && (i = ~~(Math.random() * length)); // 若需要随机播放
         if (i >= length) i = 0;
         init(objList.eq(i).attr('data-id'));

     }).on('click', '.play-oper a.icon-colle', function () {
         let isLogin = sessionStorage.getItem("isLogin")
         if (isLogin === 'true') {
             var mid = $('.play-head a').attr('href'),
                 userid = sessionStorage.getItem("id"),
                 l = mid.indexOf("=");
             mid = mid.substring(l + 1, mid.length);

             ajax("GET", "/music/collin?mid=" + mid + '&userid=' + userid, null, (data) => {
                 alert(data.msg)
             })

         } else {
             alert('请先登录')
         }
     }).on('click', '.play-oper a.icon-scdgd', function () {
         let isLogin = sessionStorage.getItem("isLogin")
         let userid = sessionStorage.getItem("id")
         if (isLogin === 'true') {
             ajax("GET", "/music/mymusiccreate?id=" + userid, null, (data) => {
                 var html = ''
                 $('#createnum').text('(' + data.length + ')')
                 $.each(data, function (index, value) {
                     html += '<li style="width:250px; height:110px;cursor:pointer;" class="clear coll-li"  data-id="' + value.slid + '">' +
                         '<img style="width:100px;height:100px;float:left;" src="../' + value.slimage + '" class="the-mumusic-delete-tou">' +
                         ' <p style="width:95px;height:90px;float:left;padding:10px">' +
                         ' <span>' + value.slname + '</span>' +
                         '</p>' +
                         '</li>'
                 })
                 let allhtml =
                     `
                        <div id="dialog" style="background:#ffffff;border:1px solid #000000;position:fixed; top:50%;left:50%;transform:translate(-50%,-50%); width:250px;height:auto">
                            <ul style="height:330px; overflow-y:auto;">${html}</ul>
                            <div style="margin:0 auto;cursor:pointer;width:50px; height:20px; line-height:20px; text-align:center; border:1px solid #666666; border-radius: 3px;" id="dialogBtn">关闭</button>
                        </div>
                    `
                 $('body').append(allhtml).on('click', '#dialogBtn', function (event) {
                     $('#dialog').remove()
                 }).on('click', '.coll-li', function () {
                     var mid = $('.play-head a').attr('href'),
                         slid = $(this).attr('data-id'),
                         l = mid.indexOf("=");
                     mid = mid.substring(l + 1, mid.length);
                     console.log(slid, mid)
                     ajax("GET", "/music/insl?slid=" + slid + '&mid=' + mid, null, (data) => {
                         alert(data.msg)
                         $('#dialog').remove()
                     })
                 })
             })
         } else {
             alert('请先登录')
         }
     }).on('click', '.play-ing .pbar .barbg', function (event) {

         var percent = event.offsetX / $(this).width();
         self.audio.currentTime = percent * self.audio.duration;

     }).on('click', '.play-ctrl a.icon-vol', function (event) {

         event.stopPropagation();
         $('.play-ctrl .cbar').toggle();
         $('.play-ctrl .cbar .cur').height(self.audio.volume * 100 + '%');

     }).on('click', '.play-ctrl .cbar', function (event) {
         var adjust = 1 - (event.pageY - $(this).offset().top) / $(this).height();
         if (adjust > 1) adjust = 1;
         else if (adjust < 0) adjust = 0;
         self.audio.volume = adjust;
         event.stopPropagation();

     }).on({
         click: function () {
             var originType = self.loopType;

             if (originType === 3) {
                 $(this).attr('class', 'icon-one');
                 $(this).siblings('.lp-tip').html('单曲循环').show();
                 self.loopType = 1;
                 self.audio.loop = true;

             } else if (originType === 2) {
                 $(this).attr('class', 'icon-shuffle');
                 $(this).siblings('.lp-tip').html('随机播放').show();
                 self.loopType = 3;
                 self.audio.loop = false;

             } else {
                 $(this).attr('class', 'icon-loop');
                 $(this).siblings('.lp-tip').html('列表循环').show();
                 self.loopType = 2;
                 self.audio.loop = false;
             }

         },

         mouseleave: function () {
             $(this).siblings('.lp-tip').hide();
         }

     }, '.play-ctrl a#data-lop').on('click', '.play-ctrl span.music-list', function () {

         $('.play-form').toggle();

     })


     // ----- audio多媒体事件委托
     $(this.audio).on('loadstart', function () { // 正在加载 loading

         $('.fix-bottom').trigger("mouseover");
         $('.play-ing .pbar .cur span.btn-cur i').css('visibility', 'visible');

     }).on('canplay', function () {

         $('.play-ing .pbar .cur span.btn-cur i').css('visibility', 'hidden');

     }).on('pause', function () {
         console.log($('.play-btns #data-ps').html());
         $('.play-btns #data-ps').removeClass('pas').addClass('ply');

     }).on('play', function () {
         $('.play-btns #data-ps').removeClass('ply').addClass('pas');

     }).on('timeupdate', function () {
         var percent = ~~(self.audio.currentTime / self.audio.duration * 1000) / 10;
         $('.play-ing .pbar .cur .cur-inner').width(percent + '%');
         $('.play-ing .pbar .clock i').html(parseTime(self.audio.currentTime));

     }).on('durationchange', function () {

         var json = null,
             data_src = self.audio.src;
         var l = data_src.split('=').length;
         var mid = data_src.split('=')[l - 1];
         mid = mid.split('.')[0];
         ajax("GET", "/music/musicinfo?mid=" + mid, null, (data) => {
             $('.play-ing .pbar .cur .cur-inner').width(0);
             $('.play-ing .ptitle a.title').html(data.mname);
             $('.play-ing .ptitle a.singer').html(data.name);
             $(self.audio).attr('data-id', data.mid);
             $('.play-head a').attr('href', 'musicdetail.html?mid=' + data.mid);
             $('.play-ing .ptitle .title').attr('href', 'musicdetail.html?mid=' + data.mid);
             $('.play-ing .ptitle .singer').attr('href', 'singerdetail.html?singerid=' + data.singerid);
         });
         $('.play-ing .clock em').html(parseTime(self.audio.duration)); //更新时间

     }).on('progress', function () { // 正在缓冲--灰色缓冲条

         var percent = 0,
             index = self.audio.buffered.length;

         if (index > 0) { // index大于0即可调用 buffered.end
             percent = ~~(self.audio.buffered.end(index - 1) / self.audio.duration * 1000) / 10;
             $('.play-ing .pbar .rdy').width(percent + '%');
         }

     }).on('volumechange', function () {

         $('.play-ctrl .cbar .cur').height(~~(self.audio.volume * 1000) / 10 + '%');

     }).on('ended', function () {

         if (self.audio.loop === false) {
             var i = 0,
                 objList = $('.form-tab ul li'),
                 length = objList.length;

             for (; i < length; i++) {
                 if ($('.form-tab ul li .abs-stus').eq(i).css('display') === 'block') {
                     i++;
                     break;
                 }
             }

             self.loopType === 3 && (i = ~~(Math.random() * length)); // 若需要随机播放
             if (i >= length) i = 0;
             init(objList.eq(i).attr('data-id'));
         }

     }).on('seeking', function () {
         console.log('seeking');
     }).on('stalled', function () {

         alert('网络中断');
     });
 };

 function parseTime(time) {
     var min = ~~(time / 60);
     var sec = ~~(time % 60);
     if (min < 10) {
         min = '0' + min;
     }
     if (sec < 10) {
         sec = '0' + sec;
     }
     return min + ':' + sec;
 }


 $(document).ready(function () {
     let music = window.sessionStorage.getItem('music') || null
     let musicTime = window.sessionStorage.getItem('musicTime') || null
     let cbar = window.sessionStorage.getItem('isLock') || null

     if (cbar == 'true') {
         $('.fix-lock a').attr('class', 'lock');
         $('.fix-play').css('display', 'block');
     } else {
         $('.fix-lock a').attr('class', 'unlock');
         $('.fix-play').css('display', 'none');
     }

     if (music && musicTime) {
         $('audio')[0].src = music;
         $('audio')[0].play();
         $('audio')[0].currentTime = musicTime
     }


     let musicList = JSON.parse(window.sessionStorage.getItem('musicList'));
     for (item in musicList) {
         ajax("GET", "/music/musicinfo?mid=" + item, null, (data) => {
             html = '<li data-id="' + data.mid + '">' +
                 '<div class="abs-stus"><span class="icn-stus"></span></div>' +
                 '<div class="col col-1">' + data.mname + '</div>' +
                 '<div class="col col-2">' +
            
                 '<a href="javascript:;" class="icn-del" title="删除"></a>' +
                 '</div>' +
                 '<div class="col col-3">' + data.name + '</div>' +
                 '</li>';
             $(mlist).append(html);
             var num = $(numMusic).text();
             $(numMusic).text(++num);
             $(mlist).siblings('.empty').hide();
         });
     };
     hhhh();
 });