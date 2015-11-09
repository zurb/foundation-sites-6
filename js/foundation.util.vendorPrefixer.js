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

  },
  touch: {

    touchstart: {

    }
  }

}
var endEvent = (function() {
  var transitions = {
    'transition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'otransitionend'
  };
  var elem = document.createElement('div');

  for (var t in transitions){
    if (typeof elem.style[t] !== 'undefined'){
      return transitions[t];
    }
  }
})();
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
var something = navigator.userAgent;
Foundation.prefix = prefix;
// console.log(navigator.userAgent, navigator.appVersion);
}(jQuery, window.Foundation);
