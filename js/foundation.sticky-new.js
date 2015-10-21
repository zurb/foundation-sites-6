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
    breakAt: '',
    stickAt: '',
    marginTop: 1,
    marginBottom: 1,
    stickyOn: 'medium',
    stickyClass: 'sticky',
    containerClass: 'sticky-container'
  };

  Sticky.prototype._init = function(){
    var $parent = this.$element.parent('[data-sticky-container]'),
        id = Foundation.GetYoDigits(6, 'sticky');

    this.$container = $parent.length ? $parent : $(this.options.container).wrapInner(this.$element).end();
    this.$container.addClass(this.options.containerClass);

    this.$element.addClass(this.options.stickyClass).attr({'data-resize': id, 'data-scroll': id});
    console.log(this.$container.css('border-top-width'), $(document).height());
    this.$element.on('resizeme.zf.trigger scrollme.zf.trigger', function(){
      console.log($(document).height());
    })

  };

  Sticky.prototype._calc = function(){

  };
  Foundation.plugin(Sticky);
}(jQuery, window.Foundation);
