!function($, Foundation){
  'use strict';

  function Swipin(element, options){
    this.$element = element;
    this.options = $.extend({}, Swipin.defaults, this.$element.data(), options || {});

    this._init();

    Foundation.registerPlugin(this);
  }

  Swipin.defaults = {
    cardClass: 'card',
    unstackOn: 'medium',
    yesClass: 'success',
    noClass: 'alert'
  };

  Swipin.prototype._init = function(){
    this.$cards = this.$element.find('.card');
    console.log(this.$cards);
    this.$cards.each(function(){
      var $card = $(this);
      // $card.addTouch();
    });
    if(!Foundation.MediaQuery.atLeast(this.options.unstackOn)){
      this._stack();
    }
    this._events();
  };

  Swipin.prototype._events = function(){
    var _this = this;
    $(window).on('changed.zf.mediaquery', function(e, newSize, oldSize){
               _this._handleMQChange(newSize, oldSize);
             });

    if(this.stacked){
      this._addSwipe();
    }

    this.$cards.find('.thumbnail').off('click.zf.swipin tap.zf.swipin')
               .on('click.zf.swipin tap.zf.swipin', function(e){
                 console.log('mouseup', $(e.target).hasClass('success'));
               });
  };
  Swipin.prototype._addBtnClicks = function(){
    var _this = this;
    this.$cards.each(function(){
      var $card = $(this);
      $card.find('.button').off('click.zf.swipin tap.zf.swipin').on('click.zf.yayornay', function(e){
        console.log($(this).hasClass('success'));
      })
    });
  }
  Swipin.prototype._addSwipe = function(){
    var _this = this;
    this.$cards.on('swiperight.zf.swipin', function(e){
                  e.preventDefault();
                  console.log('swiping right');
                   _this._swipe($(this), 'Right');
                }).on('swipeleft.zf.swipin', function(e){
                    e.preventDefault();
                    console.log('swiping left');
                   _this._swipe($(this), 'Left');
                });
  };
  Swipin.prototype._pauseSwipe = function(){
    this.$cards.off('swipeleft.zf.swipin swiperight.zf.swipin');
  }

  Swipin.prototype._swipe = function($card, dir){
    var trigger = (dir === 'Right' ? 'yesplease' : 'nothanks') + '.zf.card';

    Foundation.Motion.animateOut($card, 'slideOut' + dir, function(){
      console.log('animation done', $card);
      $card.trigger(trigger, [$card]).remove();
    });
  };

  Swipin.prototype._handleMQChange = function(newSize, oldSize){
    var _this = this;
    if(Foundation.MediaQuery.atLeast(this.options.unstackOn)){
      if(this.stacked){
        this._pauseSwipe();
        this._unstack();
      }
    }else{
      this._stack();
      this._addSwipe();
    }
  };

  Swipin.prototype._stack = function(){
    var counter = this.$cards.length;
    // var _this

    this.$cards.each(function(){
      $(this).css('z-index', counter)
             .find('.button-group').hide();
      counter--;
    });
    this.$element.addClass('is-stacked');
    this.stacked = true;
  };
  Swipin.prototype._unstack = function(){
    this.$cards.each(function(){
      $(this).css('z-index', '')
             .find('.button-group').show();
    });

    this.$element.removeClass('is-stacked');
    this.stacked = false;
  };

  Foundation.plugin(Swipin);
}(jQuery, window.Foundation);


$(document).foundation();
