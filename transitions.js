var _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;

// http://underscorejs.org/#throttle
    var throttle = function(func, wait, options) {
      var _ = {
        now: Date.now || function() {
          return new Date().getTime();
        }
      };
      var context, args, result;
      var timeout = null;
      var previous = 0;
      if (!options) {
        options = {};
      }
      var later = function() {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
          context = args = null;
        }
      };
      return function() {
        var now = _.now();
        if (!previous && options.leading === false) {
          previous = now;
        }
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) {
            context = args = null;
          }
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    };

	var getElemInfo = function(elem) {
      var offsetTop = 0;
      var offsetLeft = 0;
      var offsetHeight = elem.offsetHeight;
      var offsetWidth = elem.offsetWidth;

      do {
        if (!isNaN(elem.offsetTop)) {
          offsetTop += elem.offsetTop;
        }
        if (!isNaN(elem.offsetLeft)) {
          offsetLeft += elem.offsetLeft;
        }
      } while ((elem = elem.offsetParent) !== null);

      return {
        top: offsetTop,
        left: offsetLeft,
        height: offsetHeight,
        width: offsetWidth
      };
    };
	
var toAnimate = document.querySelectorAll('.to-raise');
var toReveal = document.querySelectorAll('.to-reveal');

var getViewportSize = function() {
  return {
	width: window.document.documentElement.clientWidth,
	height: window.document.documentElement.clientHeight
  };
}; 

var getViewportPosition = function() {
  return {
	x: window.pageXOffset,
	y: window.pageYOffset
  };
};

 // Check visibility of the element in the viewport
    var checkVisibility = function(elem) {
      var viewportSize = getViewportSize();
      var currentScroll = getViewportPosition();
      var elemInfo = getElemInfo(elem);
      var spaceOffset = 0.1;
      var elemHeight = elemInfo.height;
      var elemWidth = elemInfo.width;
      var elemTop = elemInfo.top;
      var elemLeft = elemInfo.left;
      var elemBottom = elemTop + elemHeight;
      var elemRight = elemLeft + elemWidth;

      var checkBoundaries = function() {
        // Defining the element boundaries and extra space offset
        var top = elemTop + elemHeight * spaceOffset;
        var left = elemLeft + elemWidth * spaceOffset;
        var bottom = elemBottom - elemHeight * spaceOffset;
        var right = elemRight - elemWidth * spaceOffset;

        // Defining the window boundaries and window offset
        var wTop = currentScroll.y + 0;
        var wLeft = currentScroll.x + 0;
        var wBottom = currentScroll.y - 0 + viewportSize.height - 50;
        var wRight = currentScroll.x - 0 + viewportSize.width;

        // Check if the element is within boundary
        return (top < wBottom) && (bottom > wTop) && (left > wLeft) && (right < wRight);
      };

      return checkBoundaries();
    };

    // Run a loop with checkVisibility() and add / remove classes to the elements
    var toggleElement = function() {
	
	var toAnimate = document.querySelectorAll('.to-raise');

		for (var i = 0; i < toAnimate.length; i++) {
			if (checkVisibility(toAnimate[i])) {
				toAnimate[i].classList.add('raised');
			} 
		}
	
	var toReveal = document.querySelectorAll('.to-reveal');
		for (var i = 0; i < toReveal.length; i++) {
			if (checkVisibility(toReveal[i])) {
				toReveal[i].classList.add('revealed');
			} 
		}
    };

    // Throttle events and requestAnimationFrame
    var scrollHandler = throttle(function() {
      _requestAnimationFrame(toggleElement);
    }, 300);

    var resizeHandler = throttle(function() {
      _requestAnimationFrame(toggleElement);

    }, 300);

    scrollHandler();

    // Listening for events
    if (window.addEventListener) {
      addEventListener('scroll', scrollHandler, false);
      addEventListener('resize', resizeHandler, false);
    } else if (window.attachEvent) {
      window.attachEvent('onscroll', scrollHandler);
      window.attachEvent('onresize', resizeHandler);
    } else {
      window.onscroll = scrollHandler;
      window.onresize = resizeHandler;
    }
