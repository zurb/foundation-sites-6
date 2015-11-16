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
      // 'TAB': 'down',
      // 'SHIFT_TAB': 'up'
    });
  }

  Drilldown.defaults = {
    backButton: '<li class="js-drilldown-back"><a>Back</a></li>',
    closeOnClick: false,
    crumbClass: 'drilldown-crumbs'
  };

  Drilldown.prototype._init = function(){
    this.$menuItems = this.$element.find('li');
    this.$submenus = this.$menuItems.children('ul');
    if(!this.$element.parent().hasClass('is-drilldown')){
      this.$wrapper = $('<div />').addClass('is-drilldown');
      this.$element.wrap(this.$wrapper);
      this._wrap();
    }
    this.$menuItems.add('.js-drilldown-back').children('a').attr('tabindex', 0);

    this._events();
  };
  Drilldown.prototype.drillWayUp = function(){
    this.$element.stop(true, true).find('.is-offscreen-left, .is-closing, .is-active')
        .removeClass('is-offscreen-left is-closing is-active');
    this.$element.children('li').add('a').css('visibility', '').show();
    this.isOpen = false;
    return true;
  };
  Drilldown.prototype.drilldown = function($elem){
    $elem.children('a').add($elem.siblings()).css({'visibility': 'hidden'}).addClass('is-offscreen-left');

    $elem.children('[data-submenu]').show(0, function(){
      $(this).addClass('is-active');
    });
    this.isOpen = true;
    return true;
  };
  Drilldown.prototype.drillup = function($elem){
    var $menu = $elem.parent('ul');
    $menu.addClass('is-closing').removeClass('is-active')
         .one('transitionend.zf.drilldown', function(){
           $menu.removeClass('is-closing').hide();
         });
    var link = $menu.parent('li').children('a');
    $menu.parent().siblings().add(link).css('visibility', '').removeClass('is-offscreen-left');
    if(!this.$element.children('li').hasClass('is-offscreen-left')){
      this.isOpen = false;
    }
    return true;
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
            _this.drilldown($parent);
          }else if($parent.hasClass('js-drilldown-back')){
            e.preventDefault();
            _this.drillup($parent);
          }
          return;
        }).on('keydown.zf.drilldown', function(e){
          // console.log(e.which);
          var $element = $(this).parent('li'),
              $elements = $element.parent('ul').children('li'),
              idx = $elements.index($element),
              $prevElement = $elements.eq(Math.max(0, idx-1)).children('a'),
              $nextElement = $elements.eq(Math.min(idx+1, $elements.length-1)).children('a');

          Foundation.Keyboard.handleKey(e, _this, {
            next: function() {
              if($element.hasClass('has-submenu')){
                _this.drilldown($element);
                $element.one('transitionend.zf.drilldown', function(){
                  $element.children('ul').eq(0).children('li').eq(0).children('a').focus();
                });
              }
              return;
            },
            previous: function() {
              _this.drillup($element);
              $element.parent('ul').one('transitionend.zf.drilldown', function(){
                  $element.parent('ul').parent('li').children('a').focus();
              });
              return;
            },
            up: function() {
              $prevElement.focus();
            },
            down: function() {
              $nextElement.focus();
            },
            close: function() {
              _this.drillWayUp();
              _this.$menuItems.eq(0).children('a').focus(); // focus to first element
            },
            open: function() {
              if ($element.hasClass('js-drilldown-back')) { // not menu item means back button
                _this.drillup($element);
                // console.log('closing');
                // console.log($element.parent('ul').parent('li').children('a'));
                setTimeout(function(){$element.parent('ul').parent('li').children('a').focus();}, 1);
              }else if($element.hasClass('has-submenu')){
                // console.log('opening with return');
                _this.drilldown($element);
                $element.one('transitionend.zf.drilldown', function(){
                  $element.children('ul').eq(0).children('li').eq(0).children('a:first').focus();
                // console.log('transition end on enter', $element);
                });
              }
            },
            handled: function() {
              if($element.hasClass('has-submenu js-drilldown-back')){
                e.preventDefault();
                e.stopImmediatePropagation();
              }
            }
          });
        }); // end keyboardAccess

    if(this.options.closeOnClick){
      $(document.body).off('click.zf.drilldown').on('click.zf.drilldown', function(e){
        if(_this.isOpen && !$.contains(_this.$element[0], e.target)){
          _this.drillWayUp();
        }
        return;
      });
    }
  };

  Drilldown.prototype._wrap = function(){
    var $wrap = $('<div class="is-drilldown-wrapper" />'),
        $back = $(this.options.backButton);
        // isBreaded = this.options.breadcrumbs,
        // $crumbLi = $('<li class="'+ this.options.crumbClass + '" ></li>'),
        // $crumbLink = $('<a />'),
        // _this = this;

    this.$submenus.each(function(){
      $back.clone().prependTo($(this));
      // if(isBreaded){
      //   var $crumb = $crumbLi.clone();
      //   var things = $(this).parentsUntil(_this.$element).children('a').each(function(){
      //     $crumbLink.clone().text($(this).text()).appendTo($crumb);
      //   });
      //   $crumb.prependTo($(this));
      //   console.log($crumb);
      // }
    });
    Drilldown.prototype.destroy = function(){
      this.drillWayUp();
      this.$element.unwrap().find('*').css('visibility', '').show()
          .removeClass('is-offscreen-left is-active is-closing');
      this.$submenus.find('.js-drilldown-back').remove();
      this.$menuItems.find('a').off('.zf.drilldown');
      Foundation.Nest.Burn(this.$element, 'drilldown');
      Foundation.unregisterPlugin(this);
    };
  };
  Foundation.plugin(Drilldown);
}(jQuery, window.Foundation);
