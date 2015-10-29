/**
 * Swipin module.
 * @module foundation.swipin
 * @requires foundation.util.keyboard
 * @requires foundation.util.size-and-collision
 * @requires foundation.util.triggers
 * @requires foundation.util.mediaQuery
 * @requires foundation.util.motion
 * @requires foundation.util.swipe
 * @requires foundation.util.animationFrame
 * @requires foundation.reveal
 */

!function($, Foundation){
  'use strict';

  /**
   * Creates a new instance of Swipin.
   * @class
   * @fires Swipin#init
   * @param {Object} element - jQuery object to use for the container.
   * @param {Object} options - object of options.
   * @function
   */

  function Swipin(element, options){
    this.$element = element;
    this.options = $.extend({}, Swipin.defaults, this.$element.data(), options || {});

    this._init(true);

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
    animOut: 'scaleOutDown',
    hasDetail: true
  };

  /**
   * Initializes the plugin by adding the modals(if needed) and events.
   * @private
   * @param {Boolean} firstTime - flag to only create modals if plugin is being instantiated.
   * @function
   */
  Swipin.prototype._init = function(firstTime){
    this.$element.addClass(this.options.containerClass);
    this.$cards = this.$element.find('.' + this.options.cardClass);

    if(this.options.hasDetail && firstTime){
      this._makeModals();
    }

    if(this.$element.find('.' + this.options.btnContainerClass).length){
      this.options.hasBtns = true;
    }

    if(!Foundation.MediaQuery.atLeast(this.options.unstackOn)){
      this._stack();
    }

    this._events();
  };

  /**
   * Initializes the modals for each of the cards, if selected.
   * @private
   * @function
   */
  Swipin.prototype._makeModals = function(){
    var _this = this,
        modal = '<div class="reveal" data-reveal></div>',
        counter = this.$cards.length,

        closeBtn = '<button class="close-button" aria-label="Close alert" type="button"><span>&times;</span></button>',

        lorem = '<p>This would be the details for the card.</p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do squid tempor incididunt ut labore et Foundation 6 is Awesome. Ut enim ad minim veniam, quis yetis.</p>';

    var $modals = $();
    this.reveals = [];

    this.$cards.each(function(){
      var $card = $(this),
          imgSrc = $card.find('img').attr('src'),
          id = this.id || Foundation.GetYoDigits(6, 'card-detail'),
          reveal = new Foundation.Reveal($(modal).attr('id', id)),
          $closeBtn = $(closeBtn).attr('data-close', id);

      $card.attr('data-open', id);
      reveal.$element.append($closeBtn, '<img src="' + imgSrc + '"/>' + lorem);

      _this.reveals.push(reveal);
      $modals = $modals.add(reveal.$element);
    });

    $(document.body).append($modals);
  };
  /**
   * Adds event handlers to elements in plugin
   * @private
   * @function
   */
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
  /**
   * Handles click events within each card.
   * @private
   * @function
   */
  Swipin.prototype._handleClick = function(e, $card){
    var $target = $(e.target),
        isBtn = $target.hasClass(this.options.btnClass);
        
    if(isBtn){
      e.stopImmediatePropagation();
      var isYes = $target.hasClass(this.options.yesClass);
      this.dismissCard($card, isYes, this.options.animOut);
    }
  };

  /**
   * Animates the selected card out
   * removes its element, (and destroys its corresponding modal), from the DOM
   * and fires a bubbling event of either `yesplease` or `nothanks` namespaced to `.zf.card`
   * @function
   * @param {jQuery} $card - current card to dismiss.
   * @param {Boolean} isYes - if the card was selected to be `saved` or not.
   * @param {String} animOut - the animation class Motion-UI should apply when removing the card.
   * @fires Swipin#out
   */
  Swipin.prototype.dismissCard = function($card, isYes, animOut){
    var trigger = (isYes ? 'yesplease' : 'nothanks') + '.zf.card',
        idx = this.$cards.index($card),
        _this = this;
    Foundation.Motion.animateOut($card, animOut, function(){
      /**
       * fires when the animation is complete
       * @event Swipin#out
       */
      $card.trigger(trigger, [$card]).remove();
      if(_this.options.hasDetail){
        _this.reveals[idx].destroy();
      }
    });
  };

  /**
   * Adds the `swipe` event to the plugins cards
   * @private
   * @function
   */
  Swipin.prototype._addSwipe = function(){
    var _this = this;
    this.$cards.off('swiperight.zf.swipin swipeleft.zf.swipin')
               .on('swiperight.zf.swipin', function(e){
                  e.preventDefault();
                   _this._swipe($(this), 'Right');
                }).on('swipeleft.zf.swipin', function(e){
                    e.preventDefault();
                   _this._swipe($(this), 'Left');
                });
  };
  /**
   * Removes swipe event from cards
   * @private
   * @function
   */
  Swipin.prototype._pauseSwipe = function(){
    this.$cards.off('swipeleft.zf.swipin swiperight.zf.swipin');
  }
  /**
   * Handles swipe event, and calls dismissCard
   * @private
   * @function
   */
  Swipin.prototype._swipe = function($card, dir){
    var isYes = dir === 'Right';
    this.dismissCard($card, isYes, 'slideOut' + dir);
  };
  /**
   * Handles media query change events and calls `_stack` or `_unstack`
   * @private
   * @function
   */
  Swipin.prototype._handleMQChange = function(){
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
  /**
   * Stacks the cards within the $element.
   * @private
   * @function
   * @fires Swipin#stacked
   */
  Swipin.prototype._stack = function(){
    var counter = this.$cards.length,
        _this = this;

    this.$cards.each(function(){
      $(this).css('z-index', counter)
             .find('.' + _this.options.btnClass).hide();
      counter--;
    });
    this.$element.addClass('is-stacked')
                  /**
                   * Fires when the cards unstack.
                   * @event Swipin#stacked
                   */
                 .trigger('stacked.zf.swipin');
    this.stacked = true;
  };
  /**
   * Unstacks the cards within the $element.
   * @private
   * @function
   * @fires Swipin#unstacked
   */
  Swipin.prototype._unstack = function(){
    var _this = this;
    this.$cards.each(function(){
      $(this).css('z-index', '')
             .find('.' + _this.options.btnClass).show();
    });

    this.$element.removeClass('is-stacked')
                /**
                 * Fires when the cards unstack.
                 * @event Swipin#unstacked
                 */
                 .trigger('unstacked.zf.swipin');
    this.stacked = false;
  };
  /**
   * Removes all event listeners
   * Removes all elements from the DOM
   * If modals were used, calls `Reveal.destroy` on each of them
   * @function
   * @event Swipin#destroyed
   */
  Swipin.prototype.destroy = function(){
    this.$cards.off().remove();
    if(this.options.hasDetail){
      this.reveals.forEach(function(r){
        r.destroy();
      });
    }
    Foundation.unregisterPlugin(this);
    this.$element.off().remove();
  }
  Foundation.plugin(Swipin);
}(jQuery, window.Foundation);


$(document).foundation();
