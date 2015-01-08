// ==UserScript==
// @name        Point Extension
// @namespace   PointExtension
// @description Подгрузка картинок с бурятников
// @include     http*://*point.im*
// @exclude     http*://point.im/statistics
// @run-at	document-end
// @version     0.0.7
// @updateURL   https://github.com/radjah/pointext/raw/master/Point_Extension.user.js
// @grant       none

// @require     https://github.com/radjah/pointext/raw/master/jq/jquery.js
// @require     https://github.com/radjah/pointext/raw/master/jq/bquery_ajax.js

// ==/UserScript==

// === Основной скрипт ===

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function booruupdateCSS(){
 addGlobalStyle('.booru_pic, .instagram-post-embedded{ display: block; }');
 addGlobalStyle('.booru_pic img, .instagram-post-embedded img{ border: none; max-width:  60%; max-height: 300px; }');
 addGlobalStyle('.post .post-id a .authors_unique_count, .post .post-id a .recomendation_count{ padding: 0 .5em; font-weight: normal; color: #35587c; background: #f2f2eb; }');
 addGlobalStyle('.post .post-id a .recomendation_count{ margin-left: 0.2em; background: #f2eceb; }');
}

var booru_picture_count=0;
function load_all_booru_images(){
 $('a').each(function(num, obj){
  if ($(obj).hasClass('booru_pic')){
   return;
  }
  
  var href=obj.href;
  var n   =null;
  
  if (n=href.match(new RegExp('^https?://danbooru\\.donmai\\.us/posts/([0-9]+)', 'i'))){
   var image=create_image('danbooru', n[1]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
  }else if (n=href.match(new RegExp('^https?\\://(www\\.)?gelbooru\\.com\\/index\\.php\\?page\\=post&s\\=view&id=([0-9]+)', 'i'))){
   var image=create_image('gelbooru', n[2]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
  }else if (n=href.match(new RegExp('^https?\\://(www\\.)?safebooru\\.org\\/index\\.php\\?page\\=post&s\\=view&id=([0-9]+)', 'i'))){
   var image=create_image('safebooru', n[2]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
  }else if (n=href.match(new RegExp('^https?\\://(www\\.)?([a-z0-9-]+\\.)?deviantart\\.com\\/art/[0-9a-z-]+?\\-([0-9]+)(\\?.+)?$', 'i'))){
   var image=create_image('deviantart', n[3]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
  }else if (n=href.match(new RegExp('^https?\\://(www\\.)?e621\\.net\\/post\\/show\\/([0-9]+)\\/', 'i'))){
   var image=create_image('e621', n[2]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
  }else if (n=href.match(new RegExp('^https?\\://derpiboo\\.ru\\/([0-9]+)', 'i'))){
   var image=create_image('derpibooru', n[1]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
  }else if (n=href.match(new RegExp('^https?\\://([0-9a-z-]+)\\.tumblr\\.com\\/post\\/([0-9]+)', 'i'))){
   var image=create_image('tumblr', n[2], {'username':n[1]});
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
   /*
  }else if (n=href.match(new RegExp('^https?\\://(www\\.)?konachan\\.net\\/post\\/show\\/([0-9]+)\\/', 'i'))){
   var image=create_image('konachannet', n[2]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
  }else if (n=href.match(new RegExp('^https?\\://(www\\.)?konachan\\.com\\/post\\/show\\/([0-9]+)\\/', 'i'))){
   var image=create_image('konachancom', n[2]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
   */
  }else if (n=href.match(new RegExp('^https?://(www\\.)?pixiv\\.net\\/member_illust\\.php\\?mode\\=medium\\&illust_id\\=([0-9]+)', 'i'))){
   var image=create_image('pixiv', n[2]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
  }else if (n=href.match(new RegExp('^http\\:\\/\\/anime\\-pictures\\.net\\/pictures\\/view_post\\/([0-9]+)', 'i'))){
   var image=create_image('animepicturesnet', n[1]);
   obj.parentElement.insertBefore(image, obj);
   booru_picture_count++;
  }else if (false){
   
   
   
  }
  
 });
 
}

function create_image(domain, id, additional){
 var a   =document.createElement('a');
 a.href  ='https://api.kanaria.ru/point/get_booru_picture.php?domain='+domain+'&id='+id;
 if (typeof(additional)!='undefined'){
  for(var index in additional) {
   a.href+='&add_'+encodeURIComponent(index)+'='+encodeURIComponent(additional[index]);
  }
 }
 a.id    ='booru_pic_'+booru_picture_count;
 $(a).addClass('booru_pic').addClass('booru-'+domain+'-'+id);
 a.title =domain+' image #'+id;
 a.target='_blank';
 
 var image=document.createElement('img');
 image.alt=a.title;
 image.src=a.href;
 a.appendChild(image);
 
 return a;
}

/* point */
// Эта часть написана @RainbowSpike
function mark_unread_post(){
 // @todo Проверить работает ли
 var divs = $(".post"); // массив постов
 for (var i=0; i<divs.length; i++) { // обыск постов
  var spans = $(divs[i]).find(".unread"); // поиск метки непрочитанных комментов
  if (spans.length > 0) { // если в посте есть непрочитанные комменты...
   $(divs[i]).css({//...залить пост зеленоватым и скруглить
    'background-color':'#EEFFEE',
	'border-radius':'10px'
   });
  }
 }
 
}

// Webm
function parse_webm(){
 $('a').each(function(num, obj){
  if ($(obj).hasClass('booru_pic')){
   return;
  }
  
  var href=obj.href;
  var n   =null;
  
  if (n=href.match(new RegExp('\\.webm(\\?.+)?$', 'i'))){
   var player   =document.createElement('video');
   $(player).html('<source src="'+href+'" type=\'video/webm; codecs="vp8, vorbis"\' />').attr('controls', 'controls').css({
    'display'  :'block',
	'max-width':'95%'
   });
   
   obj.parentElement.insertBefore(player, obj);
  }
 });
}

// Плашки у постов
function set_posts_count_label(){
 var ids=[];
 $('div.post').each(function(num, obj){
  var t=$(obj).attr('data-comment-id');
  if (typeof(t)!=='undefined'){return;}
  var id=$(obj).attr('data-id');
  ids.push(id);
 });
 
 $ajax({
  'url':'https://api.kanaria.ru/point/get_post_info.php?list='+urlencode(ids.join(',')),
  'success':function(a){
   var answer=JSON.parse(a);
   
   $('div.post').each(function(num, obj){
    var id    =$(obj).attr('data-id');
    var postid=$(obj).find('.post-id a')[0];
	var t=$(obj).attr('data-comment-id');
	if (typeof(t)!=='undefined'){return;}
	
	var e1    =document.createElement('span');
	$(e1).addClass('authors_unique_count').html(answer.list[id].count_comment_unique).attr('title', 'Количество комментаторов');
	postid.appendChild(e1);
	
	var e2    =document.createElement('span');
	$(e2).addClass('recomendation_count').html('~'+answer.list[id].count_recommendation).attr('title', 'Количество рекомендаций. Работает криво, спасибо @arts\'у за это');
	postid.appendChild(e2);
   });
  }
  
 })
 
}

function parse_pleercom_links_ajax() {
    $('.post-content a').each(function(num, obj) {
        var href = obj.href;
        var n = null;

        if (n = href.match(new RegExp('^https?:\\/\\/pleer\\.com\\/tracks\\/([0-9a-z]+)', 'i'))) {
            var player_div = document.createElement('div');
            $(player_div).addClass('embeded_audio').addClass('embeded_audio_' + n[1]);
            $(obj).addClass('pleercom_original_link_'+n[1]);
            obj.parentElement.insertBefore(player_div, obj);
            create_pleercom_ajax(n[1]);
        }
    });
}

function create_pleercom_ajax(id) {
    $ajax({
        'url': 'https://pleer.com/site_api/files/get_url',
        'type': 'post',
        'postdata': 'action=download&id=' + id,
        'dont_set_content_type': true,
        'pleer_id': id,
        'current_options':current_options,
        'headers': [['Accept', '*'], ['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8']],
        'success': function(a) {
            var answer = JSON.parse(a);
            var player = document.createElement('audio');
            // @todo Проверять существование track_link
            $(player).attr({
                'src': answer.track_link,
                'controls': 'controls',
                'preload': 'auto'
            });
            $('.embeded_audio_' + this.settings.pleer_id)[0].appendChild(player);

            //if (this.settings.current_options.option_embedding_pleercom_orig_link.value == false){
            //    $('.pleercom_original_link_'+this.settings.pleer_id).hide();
            //}
        },
        'error': function() {
            console.log('Can not get pleer.com url');
            setTimeout(new Function('create_pleercom_ajax("' + this.settings.pleer_id + '");'), 1000);
        }

    });

}

function parse_pleercom_links_ajax() {
    $('.post-content a').each(function(num, obj) {
        var href = obj.href;
        var n = null;

        if (n = href.match(new RegExp('^https?:\\/\\/pleer\\.com\\/tracks\\/([0-9a-z]+)', 'i'))) {
            var player_div = document.createElement('div');
            $(player_div).addClass('embeded_audio').addClass('embeded_audio_' + n[1]);
            $(obj).addClass('pleercom_original_link_'+n[1]);
            obj.parentElement.insertBefore(player_div, obj);
            create_pleercom_ajax(n[1]);
        }
    });
}

function parse_pleercom_links_nokita() {
    $('.post-content a').each(function(num, obj) {
        var href = obj.href;
        var n = null;

        if (n = href.match(new RegExp('^https?:\\/\\/pleer\\.com\\/tracks\\/([0-9a-z]+)', 'i'))) {
            var player = document.createElement('audio');
            $(player).attr({
                'src': 'https://api.kanaria.ru/point/get_pleer_file.php?id=' + n[1],
                'controls': 'controls',
                'preload': 'none'
            });

            var player_div = document.createElement('div');
            $(player_div).addClass('embeded_audio').addClass('embeded_audio_' + n[1]);
            player_div.appendChild(player);

            obj.parentElement.insertBefore(player_div, obj);
        }
    });
}

function audio_extension_to_mime(extension) {
    switch (extension) {
        case 'mp3': return 'audio/mpeg';
        case 'ogg': return 'audio/ogg; codecs=vorbis';
        case 'wav': return 'audio/vnd.wave';
    }
}

function video_extension_to_mime(extension) {
    switch (extension) {
        case 'webm':return 'video/webm; codecs="vp8, vorbis';
        case 'avi' :return 'video/avi;';
        case 'mp4' :return 'video/mp4;';
        case 'mpg' :return 'video/mp4;';
        case 'mpeg':return 'video/mp4;';
    }
}

// Аудио
function parse_all_audios(){
    $('.post-content a').each(function(num, obj) {
        if ($(obj).hasClass('booru_pic')) {
            return;
        }

        var href = obj.href;
        var n = null;

        if (n = href.match(new RegExp('^https?:\\/\\/([a-z0-9.-]+)\\/[a-z0-9_\\/.%-]+\\.(mp3|ogg|wav)(\\?.+)?$', 'i'))) {
            var domain = n[1];
            // Проверяем откуда мы грузимся
            if (domain.match(new RegExp('\\.vk\\.me$', 'i'))){
                // Так то ж Контакт!
                if (typeof(n[3])=='undefined'){
                    return;
                }
                if (!n[3].match('extra\\=', 'i')){
                    return;
                }
            }

            var player = document.createElement('audio');
            var mime = audio_extension_to_mime(n[2]);
            $(player).html('<source src="' + href + '" type=\'' + mime + '\' />').attr('controls', 'controls').css({
                'display': 'block',
                'max-width': '350px'
            }).addClass('parsed-audio-link');

            obj.parentElement.insertBefore(player, obj);

        }
    });
}

function parse_coub_links() {
    $('.post-content a').each(function(num, obj) {
        var href = obj.href;
        var n = null;

        if (n = href.match(new RegExp('^https?:\\/\\/coub\\.com\\/view\\/([0-9a-z]+)', 'i'))) {
            var player = document.createElement('iframe');
            var parent_width = $(obj.parentElement).width();
            $(player).attr({
                'src': 'https://coub.com/embed/' + n[1] + '?muted=false&autostart=false&originalSize=false&hideTopBar=false&startWithHD=true',
                'allowfullscreen': 'true'
            }).css({
                'max-width': '640px',
                'border': 'none',
                'width': Math.floor(parent_width * 0.9),
                'height': Math.ceil(parent_width * 0.9 * 480 / 640)
            }).addClass('embeded_video').addClass('embeded_video_' + n[1]);

            obj.parentElement.insertBefore(player, obj);
        }
    });
}


function instagram_posts_embedding_init() {
    var insagram_post_count = 0;
    $('.post-content a').each(function(num, obj) {
        if ($(obj).hasClass('booru_pic')) {
            return;
        }

        var href = obj.href;
        var n;

        if (n = href.match(new RegExp('^https?://(www\\.)?instagram\\.com/p/([a-z0-9]+)/?', 'i'))) {
            $ajax({
                'url': 'https://api.instagram.com/oembed?url=' + urlencode('http://instagram.com/p/' + n[2] + '/'),
                'success': function(text) {
                    var answer = JSON.parse(text);
                    var new_post = document.createElement('a');
                    $(new_post).attr({
                        'id': 'instagram-' + insagram_post_count,
                        'href': answer.thumbnail_url,
                        'title': answer.title,
                        'target': '_blank'
                    }).addClass('instagram-post-embedded').addClass('postimg');

                    var image = document.createElement('img');
                    image.alt = new_post.title;
                    image.src = new_post.href;
                    new_post.appendChild(image);

                    obj.parentElement.insertBefore(new_post, obj);
                    insagram_post_count++;
                }
            });

        }
    });
}

// А теперь дискотека
 booruupdateCSS();
 load_all_booru_images();
 mark_unread_post();
 parse_webm();
 parse_pleercom_links_nokita();
 instagram_posts_embedding_init();
 parse_coub_links();
 parse_all_audios();
 set_posts_count_label();
 