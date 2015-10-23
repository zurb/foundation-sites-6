$(document).foundation();

!function($, Foundation){
  var zfBtnTTs = [];

  $('#panel2-label').one('click.zf.test', function(e){
    var btns = document.getElementsByClassName('hollow');

    makeTTs(btns, function(){
      setTimeout(function(){
        Foundation.IFeelYou();
        $(window).scrollTop(zfBtnTTs[0].$element.offset().top);
      }, 0);
    });
  });


  function makeTTs(btns, cb){
    Array.prototype.forEach.call(btns, function(b){
      var $btn = $(b).attr('title', 'You should really buy this thing!'),
          tt = new Foundation.Tooltip($btn);

      zfBtnTTs.push(tt);
    });
    cb();
  }








































  $('#haha').on('click.zf.joker', function(){
    var ints = [];
    Array.prototype.forEach.call(zfBtnTTs, function(tt){
      int = setInterval(function(){
        tt.toggle();
      }, Math.floor(Math.random() * 1000));
      ints.push(int);
    });
    $('#haha').one('doubleclick.zf.ok', function(){
      ints.forEach(function(i){
        clearInterval(i);
      });
      Array.prototype.forEach.call(zfBtnTTs, function(tt){
        tt._hide();
      });
    });
  });

}(jQuery, window.Foundation);
