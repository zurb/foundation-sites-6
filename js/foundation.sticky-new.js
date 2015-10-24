!function($, Foundation){
  'use strict';
  function Sticky(element, options){
    this.$element = element;
    this.options = $.extend({}, Sticky.defaults, this.$element.data(), options || {});

    this._init();
  }
  Sticky.defaults = {
    stickToWindow: false,
    container: '<div data-sticky-container></div>',
    stickTo: 'top',
    stickAt: '',
    marginTop: 1,
    marginBottom: 1,
    stickyOn: 'medium',
    stickyClass: 'sticky',
    containerClass: 'sticky-container',
    checkEvery: 15
  };

  Sticky.prototype._init = function(){
    var $parent = this.$element.parent('[data-sticky-container]'),
        id = Foundation.GetYoDigits(6, 'sticky');
        // _this = this;
    this.$container = $parent.length ? $parent : $(this.options.container).wrapInner(this.$element);
    this.$container.addClass(this.options.containerClass);

    this.$anchor = this.options.stickAt ? $(this.options.stickAt) : $(document.body);

    this.$element.addClass(this.options.stickyClass)
                 .attr({'data-resize': id, 'data-scroll': id});

    // this.isTop = this.options.stickTo === 'top';
    // console.log(this.$container.css('border-top-width'), $(document).height());
    this.scrollCount = this.options.checkEvery;
    this._calc(true);
    this._events();

  };
  Sticky.prototype._events = function(){
    var _this = this;

    this.$element.off('resizeme.zf.trigger')
                 .on('resizeme.zf.trigger', function(e, el){
                   console.log(e, el);
                   setTimeout(function(){
                      _this._calc(true);
                   }, 5)
    });

    $(window).on('scroll.zf.sticky', function(e){
      if(_this.scrollCount){
        _this.scrollCount--;
        _this._calc(false, e.currentTarget.scrollY);
      }else{
        _this.scrollCount = _this.options.checkEvery;
        _this._calc(true, e.currentTarget.scrollY);
      }
    });
  }

  Sticky.prototype._calc = function(checkSizes, scroll){
    if(checkSizes){ this._setSizes(); }
    if(!scroll){ scroll = $(document.body).scrollTop(); }

    if(scroll >= this.topPoint){
      if(scroll <= this.bottomPoint){
        this._setSticky();
      }else{
        if(this.$element.hasClass('is-stuck')){
          this._removeSticky(false);
        }
      }
    }else{
      if(this.$element.hasClass('is-stuck')){
        this._removeSticky(true);
      }
    }
  };
  Sticky.prototype._setSticky = function(){
    var stickTo = this.options.stickTo,
        mrgn = stickTo === 'top' ? 'marginTop' : 'marginBottom',
        notStuckTo = stickTo === 'top' ? 'bottom' : 'top',
        css = {};

    css[mrgn] = this.options[mrgn] + 'em';
    css[stickTo] = 0;
    css[notStuckTo] = 'auto';

    this.$element.removeClass('is-anchored is-at-' + notStuckTo)
                 .addClass('is-stuck is-at-' + stickTo)
                 .css(css);
  };
  Sticky.prototype._removeSticky = function(isTop){
    var stickTo = this.options.stickTo,
        stickToTop = stickTo === 'top',
        css = {}, mrgn, notStuckTo;
        mrgn = stickToTop ? 'marginTop' : 'marginBottom';
        notStuckTo = stickToTop ? 'bottom' : 'top';
      css[mrgn] = 0;

    if((isTop && !stickToTop) || (stickToTop && !isTop)){
      css[stickTo] = this.anchorHeight - this.$element.height();
      css[notStuckTo] = 0;
    }else{
      css[stickTo] = 0;
      css[notStuckTo] = this.anchorHeight - this.$element.height();
    }
    this.$element.removeClass('is-stuck is-at-' + stickTo)
                 .addClass('is-anchored is-at-' + (isTop ? 'top' : 'bottom'))
                 .css(css);
  };

  Sticky.prototype._setSizes = function(cb){
    var _this = this,
        newElemWidth = this.$container[0].getBoundingClientRect().width,
        pdng = parseInt(window.getComputedStyle(this.$container[0])['padding-right'], 10);

    this.anchorHeight = this.$anchor[0].getBoundingClientRect().height;
    this.$element.css({
      'max-width': newElemWidth - pdng + 'px'
    });

    var newContainerHeight = this.$element[0].getBoundingClientRect().height;

    this.$container.css({
      height: newContainerHeight
    });
    this._setBreakPoints(newContainerHeight, function(){
      if(cb){ cb(); }
    });

  };
  Sticky.prototype._setBreakPoints = function(elemHeight, cb){
    var mTop = emCalc(this.options.marginTop),
        mBtm = emCalc(this.options.marginBottom),
        topPoint = this.$anchor.offset().top,
        bottomPoint = topPoint + this.$anchor[0].getBoundingClientRect().height,
        winHeight = window.innerHeight;
    if(this.options.stickTo === 'top'){
      topPoint -= mTop;
      bottomPoint -= this.$element[0].getBoundingClientRect().height + mTop;
    }else if(this.options.stickTo === 'bottom'){
      topPoint -= (winHeight - (elemHeight + mBtm));
      bottomPoint -= (winHeight - mBtm);
    }else{
      //this would be the stickTo: both option... tricky
    }

    this.topPoint = topPoint;
    this.bottomPoint = bottomPoint;

    cb();
  };

  function emCalc(em){
    return parseInt(window.getComputedStyle(document.body, null).fontSize, 10) * em;
  }
  Foundation.plugin(Sticky);
}(jQuery, window.Foundation);
