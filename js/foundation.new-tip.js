!function($, Foundation){
  'use strict';

  function Tooltip(element, options){
    this.$element = element;
    this.options = $.extend({}, Tooltip.defaults, this.$element.data(), options);

    this._init();

    Foundation.registerPlugin(this);
    // console.log(window.getComputedStyle(this.$tip[0]).left);
  }

  Tooltip.defaults = {
    hoverDelay: 200,
    fadeInDuration: 150,
    fadeOutDuration: 150,
    hover: true,
    tooltipClass: 'tooltip',
    triggerClass: 'has-tip',
    showOn: 'all',
    template: '',
    tipText: 'Some Generic text for testing purposes',
    // touchCloseText: 'Tap to close.',
    clickOpen: true,
    // appendTo: 'body',
    positionClass: ''
  };

  Tooltip.prototype._init = function(){
    // console.log(this.options.positionClass === '');
    var elemId = this.$element.attr('aria-describedby') || Foundation.GetYoDigits(6, 'tooltip');

    this.options.positionClass = this.options.positionClass || this.getPositionClass(this.$element);
    this.$tip = this.options.template.length ? $(this.options.template) : this.makeTemplate(elemId);

    this.$tip.appendTo(this.$element)
        .text(this.options.tipText);
    this.$element.attr({
      'aria-describedby': elemId,
      'data-yeti-box': elemId,
      'data-toggle': elemId,
      'data-resize': elemId,
      'aria-haspopup': true,
      'tabindex': 0,
      'data-tip-text': ''
    }).addClass(this.options.triggerClass)
    this.setPosition();
    // this.getSize();
    this._events();

  };
  Tooltip.prototype.getPositionClass = function(element){
    if(!element){ return ''; }
    var position = element[0].className.match(/(is-top|is-left|is-right)/g);
        position = position ? position[0] : '';
    return position;
  };
  Tooltip.prototype.checkPos = function(isResize, cb){
    var _this = this;
    this.$tip.css('visibility', 'hidden').show();
    if(isResize){
      this.setPosition(function(){});
    }
    if(!Foundation.ImNotTouchingYou(_this.$tip)){
      //change classes
      // this.changePos();
      console.log('touching');
    }
    this.$tip.hide().css('visibility', '');
    if(cb){ cb(); }
  };
  Tooltip.prototype.setPosition = function(cb){
    var tipDims = this.$tip[0].getBoundingClientRect(),
        w = tipDims.width,
        h = tipDims.height,
        comp = window.getComputedStyle(this.$element[0]),
        curClass = this.getPositionClass(this.$tip),
        css = {},
        funcs = {
          'is-top': function(){
            funcs['is-btm']();
            css['top'] = h / 2;
            css['left'] = -css['margin-left'] / 2;
            css['right'] = -css['margin-right'] / 2;
          },
          'is-btm': function(){
            css['margin-left'] = -(w / 2) - parseInt(comp['margin-left'], 10);
            css['margin-right'] = -(w / 2) - parseInt(comp['margin-right'], 10);
            // css['left'] = -css['margin-left'] / 2;
            // css['right'] = -css['margin-right'] / 2;
          },
          'is-left': function(){
            funcs['is-side']('right');
          },
          'is-right': function(){
            funcs['is-side']('left');
          },
          'is-side': function(side){
            css[side] = '100%';
            css['top'] = parseInt(comp['height'], 10) / 2;
          },
          'anyPos': function(){
            css['margin-top'] = -(h / 2) - parseInt(comp['margin-top'], 10);
            css['margin-bottom'] = -(h / 2) - parseInt(comp['margin-bottom'], 10);
          }
        };
    // console.log(h, w, curClass);
    funcs[curClass || 'is-btm']();

    if(curClass){
      funcs.anyPos();
    }

    this.$tip.css(css);
    if(cb){ cb(); }
  };
  Tooltip.prototype._events = function(){
    var _this = this;

    if(this.options.hover){
      this.$element.on({//need to set up with timeouts
        'mouseenter.zf.tooltip': this.open.bind(this),
        'mouseleave.zf.tooltip': this.close.bind(this)
      });
    }
    this.$tip.on({
      'open.zf.trigger': this.open.bind(this),
      'close.zf.trigger': this.close.bind(this),
      'toggle.zf.trigger': this.toggle.bind(this),
      'resizeme.zf.trigger': this.checkPos.bind(this, true)
    });
  };
  Tooltip.prototype.toggle = function(){
    console.log('firing toggle');
    if(this.$tip.data('open')){
      this.close();
    }else{
      this.open();
    }
  };
  Tooltip.prototype.open = function(){
    console.log('firing open');
    var _this = this;
    var check = !this.$tip.hasData('open');
    console.log(check);
    this.checkPos(check, function(){
      _this.$tip.attr('aria-hidden', false).data('open', true);
      Foundation.Move(_this.options.fadeInDuration, _this.$tip, function(){
        _this.$tip.fadeIn(_this.options.fadeInDuration);
      });
    });

  };
  Tooltip.prototype.close = function(){
    this.$tip.attr('aria-hidden', true).data('open', false)
        .fadeOut(this.options.fadeOutDuration);
  };
  Tooltip.prototype.makeTemplate = function(id){
    var classes = (this.options.tooltipClass + ' ' + this.options.positionClass).trim();

    return $('<div />').addClass(classes).attr({
                                                'role': 'tooltip',
                                                'aria-hidden': true,
                                                'id': id
                                              });
  };
  Foundation.plugin(Tooltip);
  (function($){
    $.fn.hasData = function(name){
      return this.data(name) !== undefined;
    };
  })(jQuery)

}(jQuery, window.Foundation);
