!function($, Foundation){
  'use strict';

  function Drilldown(element, options){
    this.$element = element;
    this.options = $.extend({}, Drilldown.defaults, this.$element.data(), options);

    Foundation.Nest.Feather(this.$element, 'drilldown');

    this._init();
    Foundation.registerPlugin(this);
    Foundation.Keyboard.register('Drilldown', {
      'ENTER': 'open',
      'SPACE': 'open',
      'ARROW_RIGHT': 'next',
      'ARROW_UP': 'up',
      'ARROW_DOWN': 'down',
      'ARROW_LEFT': 'previous',
      'ESCAPE': 'close',
      'TAB': 'down',
      'SHIFT_TAB': 'up'
    });
  }

  Drilldown.defaults = {
    backButton: '<li class="js-drilldown-back"><a>Back</a></li>',
    closeOnClick: false,
    // holdOpen: false
  };

  Drilldown.prototype._init = function(){
    this.$menuItems = this.$element.find('li');
    this.$submenus = this.$menuItems.children('ul');

    if(!this.$element.parent().hasClass('is-drilldown')){
      this.$wrapper = $('<div />').addClass('is-drilldown')//.css(this.getMaxHeight());
      this.$element.wrap(this.$wrapper);
      this._wrap();
    }
    console.log(this.$element.find('.js-drilldown-back'));
    // console.log(this.$menuItems, this.$submenus);
    this._events();
  };
  Drilldown.prototype.drilldown = function($elem){
    var sibs = $elem.siblings();
    $elem.children('a').add(sibs).css({'visibility': 'hidden'}).addClass('is-offscreen-left');

    $elem.children('[data-submenu]').show(0, function(){
      $elem.children('[data-submenu]').addClass('is-active');
    });
  };
  Drilldown.prototype.drillup = function($elem){
    console.log($elem.parent().parent().siblings());
    var $menu = $elem.parent('ul');
    $menu.addClass('is-closing').removeClass('is-active')
         .one('transitionend.zf.drilldown', function(){
           $menu.removeClass('is-closing').hide();
         });
    var link = $menu.parent('li').children('a');
    var toShow = $elem.parent().parent().siblings().add(link).css('visibility', '').removeClass('is-offscreen-left');
  };
  Drilldown.prototype._events = function(){
    var _this = this;

    this.$menuItems.add(this.$element.find('.js-drilldown-back'))
        .children('a').off('.zf.drilldown')
        .on('click.zf.drilldown', function(e){
          var $item = $(this),
              $parent = $item.parent('li');

          if($parent.hasClass('has-submenu')){
            e.preventDefault();
            //open
            _this.drilldown($parent);
          }else if($parent.hasClass('js-drilldown-back')){
            e.preventDefault();
            console.log('back', $parent);
            _this.drillup($parent);
            //back
          }
          console.log($(this).parent('li').hasClass('has-submenu'));
          return;
        }).on('keydown.zf.drilldown', function(e){
          var $element = $(this),
              $elements = $element.parent('ul').children('li'),
              $prevElement,
              $nextElement;

          $elements.each(function(i) {
            if ($(this).is($element)) {
              $prevElement = $elements.eq(Math.max(0, i-1));
              $nextElement = $elements.eq(Math.min(i+1, $elements.length-1));
              return;
            }
          });
          Foundation.Keyboard.handleKey(e, _this, {
            next: function() {
              if ($element.is(_this.$submenuAnchors)) {
                _this._show($element);
                $element.on('transitionend.zf.drilldown', function(){
                  $element.find('ul li').filter(_this.$menuItems).first().focus();
                });
              }
            },
            previous: function() {
              _this._hide($element.parent('ul'));
              $element.parent('ul').on('transitionend.zf.drilldown', function(){
                setTimeout(function() {
                  $element.parent('ul').parent('li').focus();
                }, 1);
              });
            },
            up: function() {
              $prevElement.focus();
            },
            down: function() {
              $nextElement.focus();
            },
            close: function() {
              _this._back();
              //_this.$menuItems.first().focus(); // focus to first element
            },
            open: function() {
              if (!$element.is(_this.$menuItems)) { // not menu item means back button
                _this._hide($element.parent('ul'));
                setTimeout(function(){$element.parent('ul').parent('li').focus();}, 1);
              } else if ($element.is(_this.$submenuAnchors)) {
                _this._show($element);
                setTimeout(function(){$element.find('ul li').filter(_this.$menuItems).first().focus();}, 1);
              }
            },
            handled: function() {
              e.preventDefault();
              e.stopImmediatePropagation();
            }
          });
        }); // end keyboardAccess
  };

  Drilldown.prototype._wrap = function(){
    var $wrap = $('<div class="is-drilldown-wrapper" />'),
        $back = $(this.options.backButton);

    this.$submenus.each(function(){
      $back.clone().prependTo($(this));
    });
  };
  Foundation.plugin(Drilldown);
}(jQuery, window.Foundation);
