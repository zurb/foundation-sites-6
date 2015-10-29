!function($, Foundation){
  'use strict';

  function Swipin(element, options){
    this.$element = element;
    this.options = $.extend({}, Swipin.defaults, this.$element.data(), options || {});

    this._init();

    Foundation.registerPlugin(this);
  }

  Swipin.defaults = {
    containerClass: 'swipin',
    cardClass: 'card',
    unstackOn: 'medium',
    yesClass: 'success',
    noClass: 'alert',
    hasBtns: true,
    btnContainerClass: 'button-group',
    btnClass: 'button',
    animOut: 'scaleOutDown'
  };

  Swipin.prototype._init = function(){
    this.$element.addClass(this.options.containerClass);
    this.$cards = this.$element.find('.' + this.options.cardClass);
    var _this = this;
    this._makeModals(function(){
      // $(document.body).append(_this.$modals);
      // _this.$modals.appendTo('body');
    });
    if(this.$element.find('.' + this.options.btnContainerClass).length){
      this.options.hasBtns = true;
    }

    if(!Foundation.MediaQuery.atLeast(this.options.unstackOn)){
      this._stack();
    }

    this._events();
  };
  Swipin.prototype._makeModals = function(cb){
    var _this = this,
        modal = '<div class="reveal" data-reveal></div>',
        counter = this.$cards.length,
        lorem = '<p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';
    this.$modals = $();
    this.$cards.each(function(){
      var $card = $(this),
          imgSrc = $card.find('img').attr('src'),
          id = this.id || Foundation.GetYoDigits(6, 'card-detail'),
          $modal = new Foundation.Reveal($(modal).attr('id', id));
      $card.attr('data-open', id);
      $modal.$element.append('<img src="' + imgSrc + '"/>' + lorem);
      _this.$modals = _this.$modals.add($modal.$element);
      counter--
    });
    $(document.body).append(_this.$modals);
    cb();
  };
  Swipin.prototype._events = function(){
    var _this = this;
    $(window).on('changed.zf.mediaquery', function(e, newSize, oldSize){
               _this._handleMQChange(newSize, oldSize);
             });

    if(this.stacked){
      this._addSwipe();
    }

    this.$cards.off('click.zf.swipin tap.zf.swipin')
               .on('click.zf.swipin tap.zf.swipin', function(e){
                 _this._handleClick(e, $(this));
               });
  };

  Swipin.prototype._handleClick = function(e, $card){
    var $target = $(e.target),
        isBtn = $target.hasClass(this.options.btnClass);

    if(isBtn){
      e.stopImmediatePropagation();
      var isYes = $target.hasClass(this.options.yesClass);
      this.dismissCard($card, isYes, this.options.animOut);
    }
  };

  Swipin.prototype.dismissCard = function($card, isYes, animOut){
    var trigger = (isYes ? 'yesplease' : 'nothanks') + '.zf.card';
    Foundation.Motion.animateOut($card, animOut, function(){
      $card.trigger(trigger, [$card]).remove();
    });
  };

  Swipin.prototype._addSwipe = function(){
    var _this = this;
    this.$cards.on('swiperight.zf.swipin', function(e){
                  e.preventDefault();
                   _this._swipe($(this), 'Right');
                }).on('swipeleft.zf.swipin', function(e){
                    e.preventDefault();
                   _this._swipe($(this), 'Left');
                });
  };

  Swipin.prototype._pauseSwipe = function(){
    this.$cards.off('swipeleft.zf.swipin swiperight.zf.swipin');
  }

  Swipin.prototype._swipe = function($card, dir){
    var isYes = dir === 'Right';
    this.dismissCard($card, isYes, 'slideOut' + dir);
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
    var counter = this.$cards.length,
        _this = this;

    this.$cards.each(function(){
      $(this).css('z-index', counter)
             .find('.' + _this.options.btnClass).hide();
      counter--;
    });
    this.$element.addClass('is-stacked');
    this.stacked = true;
  };

  Swipin.prototype._unstack = function(){
    var _this = this;
    this.$cards.each(function(){
      $(this).css('z-index', '')
             .find('.' + _this.options.btnClass).show();
    });

    this.$element.removeClass('is-stacked');
    this.stacked = false;
  };

  Foundation.plugin(Swipin);
}(jQuery, window.Foundation);


$(document).foundation();
// $(window).on('yesplease.zf.card nothanks.zf.card', function(e){
//   console.log(e);
// });
