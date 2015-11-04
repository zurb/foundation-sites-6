!function($, Foundation){
  'use strict';

  function Tooltip(element, options){
    this.$element = element;
    this.options = $.extend({}, Tooltip.defaults, this.$element.data(), options);

    this._init();

    // Foundation.registerPlugin(this);
  }

  Tooltip.defaults = {
    disableForTouch: false,
    hoverDelay: 200,
    fadeInDuration: 150,
    fadeOutDuration: 150,
    disableHover: false,
    templateClasses: '',
    tooltipClass: 'tooltip',
    triggerClass: 'has-tip',
    showOn: 'all',
    template: '',
    tipText: '',
    touchCloseText: 'Tap to close.',
    clickOpen: true,
    appendTo: 'body',
    positionClass: '',
    vOffset: 10,
    hOffset: 12
  }

}(jQuery, window.Foundation);
