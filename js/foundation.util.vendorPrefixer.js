!function($, Foundation){
  var eventCategories = {

  // Eg: Modernizr.prefixed('transition')
  transition: {

    transitionend: {
      'WebkitTransition' : 'webkitTransitionEnd',
      'MozTransition'    : 'transitionend',
      'OTransition'      : 'oTransitionEnd',
      'msTransition'     : 'MSTransitionEnd',
      'transition'       : 'transitionend'
    }

    // Just wishful thinking :)
    //transitionstart: {
    //  'WebkitTransition' : 'webkitTransitionStart',
    //  'MozTransition'    : 'transitionstart',
    //  'OTransition'      : 'oTransitionStart',
    //  'msTransition'     : 'MSTransitionStart',
    //  'transition'       : 'transitionstart'
    //}

  },

  animation: {

    animationstart: {
      'WebkitAnimation' : 'webkitAnimationStart',
      'MozAnimation'    : 'animationstart',
      'OAnimation'      : 'oAnimationStart',
      'msAnimation'     : 'MSAnimationStart',
      'animation'       : 'animationstart'
    },

    animationiteration: {
      'WebkitAnimation' : 'webkitAnimationIteration',
      'MozAnimation'    : 'animationiteration',
      'OAnimation'      : 'oAnimationIteration',
      'msAnimation'     : 'MSAnimationIteration',
      'animation'       : 'animationiteration'
    },

    animationend: {
      'WebkitAnimation' : 'webkitAnimationEnd',
      'MozAnimation'    : 'animationend',
      'OAnimation'      : 'oAnimationEnd',
      'msAnimation'     : 'MSAnimationEnd',
      'animation'       : 'animationend'
    }

  }

}
  var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();
Foundation.prefix = prefix;
console.log(prefix);
}(jQuery, window.Foundation);
