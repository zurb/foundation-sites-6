!function($, Foundation){
  'use strict';

  function Swipin(element, options){
    console.log('wtf mate');
    this.$element = element;
    this.options = $.extend({}, Swipin.defaults, this.$element.data(), options || {});

    this._init();

    Foundation.registerPlugin(this);
  }

  Swipin.defaults = {
    cardClass: 'card',
    unstackOn: 'medium'
  };

  Swipin.prototype._init = function(){
    this.$cards = this.$element.find('.card');

    this._events();
  };

  Swipin.prototype._events = function(){
    var _this = this;
    $(window).on('changed.zf.mediaquery', function(e, newSize, oldSize){
      console.log(newSize);
      _this._handleMQChange(newSize, oldSize);
    });

  };
  Swipin.prototype._handleMQChange = function(newSize, oldSize){
    var _this = this;

    if(Foundation.MediaQuery.atLeast(this.options.unstackOn)){
      if(this.stacked){
        this._unstack();
      }
    }else{
      this._stack();
    }
  };
  Swipin.prototype._stack = function(){
    this.$cards.addClass('is-stacked');
    this.stacked = true;
  };
  Swipin.prototype._unstack = function(){
    this.$cards.removeClass('is-stacked');
    this.stacked = false;
  };

  Foundation.plugin(Swipin);
}(jQuery, window.Foundation);

$(document).foundation();
