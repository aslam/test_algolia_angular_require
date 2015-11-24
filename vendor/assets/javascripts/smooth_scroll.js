// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik MÃ¶ller. fixes from Paul Irish and Tino Zijdel
// MIT license
//rf.js
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
// vs.js
var vs = (function(document) {
    
    if("undefined" != typeof module && "undefined" != typeof module.exports) var vs = module.exports = {}; else var vs = {};
    
    var numListeners, listeners = [], initialized = false;

    var touchStartX, touchStartY;

    // [ These settings can be customized with the options() function below ]
    // Mutiply the touch action by two making the scroll a bit faster than finger movement
    var touchMult = 1;
    // Firefox on Windows needs a boost, since scrolling is very slow
    var firefoxMult = 15;
    // How many pixels to move with each key press
    var keyStep = 120;
    // General multiplier for all mousehweel including FF
    var mouseMult = 1;

    var bodyTouchAction;

    var hasWheelEvent = 'onwheel' in document;
    var hasMouseWheelEvent = 'onmousewheel' in document;
    var hasTouch = 'ontouchstart' in document;
    var hasTouchWin = navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1;
    var hasPointer = !!window.navigator.msPointerEnabled;
    var hasKeyDown = 'onkeydown' in document;

    var isFirefox = navigator.userAgent.indexOf('Firefox') > -1;

    var event = {
        y: 0,
        x: 0,
        deltaX: 0,
        deltaY: 0,
        originalEvent: null
    };

    vs.on = function(f) {
        if(!initialized) initListeners(); 
        listeners.push(f);
        numListeners = listeners.length;
    }

    vs.options = function(opt) {
        keyStep = opt.keyStep || 120;
        firefoxMult = opt.firefoxMult || 15;
        touchMult = opt.touchMult || 2;
        mouseMult = opt.mouseMult || 1;
    }

    vs.off = function(f) {
        listeners.splice(f, 1);
        numListeners = listeners.length;
        if(numListeners <= 0) destroyListeners();
    }

    var notify = function(e) {
        event.x += event.deltaX;
        event.y += event.deltaY;
        event.originalEvent = e;

        for(var i = 0; i < numListeners; i++) {
            listeners[i](event);
        }
    }

    var onWheel = function(e) {
        // In Chrome and in Firefox (at least the new one)
        event.deltaX = e.wheelDeltaX || e.deltaX * -1;
        event.deltaY = e.wheelDeltaY || e.deltaY * -1;

        // for our purpose deltamode = 1 means user is on a wheel mouse, not touch pad 
        // real meaning: https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent#Delta_modes
        if(isFirefox && e.deltaMode == 1) {
            event.deltaX *= firefoxMult;
            event.deltaY *= firefoxMult;
        } 

        event.deltaX *= mouseMult;
        event.deltaY *= mouseMult;

        notify(e);
    }

    var onMouseWheel = function(e) {
        // In Safari, IE and in Chrome if 'wheel' isn't defined
        event.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
        event.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;

        notify(e);  
    }

    var onTouchStart = function(e) {
        var t = (e.targetTouches) ? e.targetTouches[0] : e;
        touchStartX = t.pageX;  
        touchStartY = t.pageY;
    }

    var onTouchMove = function(e) {
        // e.preventDefault(); // < This needs to be managed externally
        var t = (e.targetTouches) ? e.targetTouches[0] : e;

        event.deltaX = (t.pageX - touchStartX) * touchMult;
        event.deltaY = (t.pageY - touchStartY) * touchMult;
        
        touchStartX = t.pageX;
        touchStartY = t.pageY;

        notify(e);
    }

    var onKeyDown = function(e) {
        // 37 left arrow, 38 up arrow, 39 right arrow, 40 down arrow
        event.deltaX = event.deltaY = 0;
        switch(e.keyCode) {
            case 37:
                event.deltaX = -keyStep;
                break;
            case 39:
                event.deltaX = keyStep;
                break;
            case 38:
                event.deltaY = keyStep;
                break;
            case 40:
                event.deltaY = -keyStep;
                break;
        }

        notify(e);
    }

    var initListeners = function() {
        if(hasWheelEvent) document.addEventListener("wheel", onWheel);
        if(hasMouseWheelEvent) document.addEventListener("mousewheel", onMouseWheel);

        if(hasTouch) {
            document.addEventListener("touchstart", onTouchStart);
            document.addEventListener("touchmove", onTouchMove);
        }
        
        if(hasPointer && hasTouchWin) {
            bodyTouchAction = document.body.style.msTouchAction;
            document.body.style.msTouchAction = "none";
            document.addEventListener("MSPointerDown", onTouchStart, true);
            document.addEventListener("MSPointerMove", onTouchMove, true);
        }

        if(hasKeyDown) document.addEventListener("keydown", onKeyDown);

        initialized = true;
    }

    var destroyListeners = function() {
        if(hasWheelEvent) document.removeEventListener("wheel", onWheel);
        if(hasMouseWheelEvent) document.removeEventListener("mousewheel", onMouseWheel);

        if(hasTouch) {
            document.removeEventListener("touchstart", onTouchStart);
            document.removeEventListener("touchmove", onTouchMove);
        }
        
        if(hasPointer && hasTouchWin) {
            document.body.style.msTouchAction = bodyTouchAction;
            document.removeEventListener("MSPointerDown", onTouchStart, true);
            document.removeEventListener("MSPointerMove", onTouchMove, true);
        }

        if(hasKeyDown) document.removeEventListener("keydown", onKeyDown);

        initialized = false;
    }

    return vs;
})(document);

// smmoth.js
var Smooth = function(opt) {
    
    if (!(this instanceof Smooth))
        return new Smooth(opt)
        
    this.createBound();

    opt = opt || {}

    this.rAF = undefined;
    
    this.pos = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    
    this.direction = opt.direction || 'vertical';
    
    this.section = opt.section || document.querySelector('.vs-section');

    this.ease = opt.ease || 0.1;
    
    this.els = (typeof opt.els != 'undefined') ? Array.prototype.slice.call(opt.els, 0) : [this.section];

    this.els.forEach(function(el) {
            el.pos = {};
            el.pos.targetX = 0, 
            el.pos.targetY = 0, 
            el.pos.currentX =  0, 
            el.pos.currentY =  0,
            el.stopped = false 
        });
    this.scrollYpos = 0;
    this.clientYpos = 0;
    
    this.boundingPos = 0;

    this.verticalMove = 0;
    this.verticalMoveRatio = 0;

    this.lastSection = {
                            element : opt.lastSection,
                            topOffset : opt.lastSection.offsetTop,
                            calculatedHeight : opt.lastSection.getBoundingClientRect().height
                        };

    this.extraMove = 0; // keeps track of how much main section and longest section has already moved to find max CurrentY
    this.opacityPoints = opt.opacityPoints;

    this.stickySection = opt.stickySection;

    this.ui = { newOpacities : [1, 1] };
    
    this.to = Array.prototype.slice.call(document.querySelectorAll('.vs-scrollto'), 0);

    this.bounding = (this.direction == 'vertical')
        ? this.section.getBoundingClientRect().height - window.innerHeight
        : this.section.getBoundingClientRect().left + this.section.getBoundingClientRect().right - window.innerHeight;
    this.scrollbar = {
        active: (typeof opt.scrollbar != 'undefined') ? opt.scrollbar.active : 'false',
        el: document.createElement('div'),
        drag: {
            el: document.createElement('div'),
            clicked: false,
            deltaY: 0, deltaX: 0,
            speed: (typeof opt.scrollbar != 'undefined') ? opt.scrollbar.speed || 3 : 3,
            height:  (typeof opt.scrollbar != 'undefined') ? opt.scrollbar.height || 50 : 50
        },
        bg: (typeof opt.scrollbar != 'undefined') ? opt.scrollbar.bg : 'false',
        main: (typeof opt.scrollbar != 'undefined') ? opt.scrollbar.main : 'false'
    }

    this.mobileDeviceSpeed = opt.mobileDeviceSpeed;
        
};

Smooth.prototype.constructor = Smooth;

Smooth.prototype.isSmartPhonesOrTablet = function () {
     return /iphone|ipod|ipad|android|webos|blackberry|windows phone/i.test(navigator.userAgent.toLowerCase());
};

Smooth.prototype.init = function() {

    var self = this;
    this.windowHeight = window.innerHeight;
    this.els.forEach(function(el){
        el.speed = (self.els.length >= 2) ? el.element.getAttribute('data-speed') : 1;
        if (self.isSmartPhonesOrTablet()) {
            el.speed = self.mobileDeviceSpeed*el.speed;
        }
    });
    this.sectionSpeed = this.els[0].speed;

    self.mainSectionHeight = self.section.getBoundingClientRect().height;
    self.mainSectionOffsetFromTop = self.section.getBoundingClientRect().top;
    self.sectionHeight = self.section.getBoundingClientRect().height;
    self.sectionOffsetTop = self.section.getBoundingClientRect().top;
    var stopPoint = (self.sectionHeight - (self.windowHeight - self.sectionOffsetTop))/2;
    self.boundingPos = (self.mainSectionHeight+ self.mainSectionOffsetFromTop - stopPoint - self.windowHeight)/self.sectionSpeed; 
    var e = {deltaY : 1, deltaX : 0} // to initialize calc when browser resized
    this.opacityPoints.forEach(function(elem, index) {
        elem.topOffset = elem.element.getBoundingClientRect().top;
    });
    this.calc(e);

    this.build();

    this.bodyKlass = document.body.classList;

    vs.on(this.calc);
    vs.on(this.calcScroll);

    this.to.forEach(function(el){
        var data = el.getAttribute('data-scroll');
        
        el.targetPos = (!isNaN(data))
            ? data
            : (self.direction == 'vertical')
                ? document.querySelector('.'+data).getBoundingClientRect().top
                : document.querySelector('.'+data).getBoundingClientRect().left
        
        el.addEventListener('click', self.getTo.bind(self, el));
    });
    
    document.addEventListener('touchmove', this.prevent);
    window.addEventListener('resize', this.resize);
    this.run();

};

Smooth.prototype.createBound = function() {
    
    ['down', 'move', 'up', 'calcScroll', 'calc', 'getTo', 'prevent', 'resize']
    .forEach(function(fn) {
        this[fn] = this[fn].bind(this);
    }, this);
    
};

Smooth.prototype.prevent = function(e) {
    e.preventDefault();
};

Smooth.prototype.calc = function(e) {
    var self = this;
    this.deltaY = e.deltaY;
    this.calculateYpos(e);

};

Smooth.prototype.calculateYpos = function (e) {
    var self = this;
    this.els.forEach(function(el) {
        if (el.hasOwnProperty('isolatedMovement') && (el.element.getBoundingClientRect().top > el.startAtOffset || el.element.getBoundingClientRect().bottom < el.bottomOffset)) {
            return;
        }
        // stop moving element after maxMove
        if (el.hasOwnProperty('maxMove') && (Math.abs(el.pos.targetY)*el.speed > el.maxMove) && (e.deltaY <= 0)) {
                return;
        }
        if (el.hasOwnProperty('maxMoveRatio') && (Math.abs(el.pos.targetY)*el.speed > (el.maxMoveRatio*self.windowHeight)) && (e.deltaY <= 0)) {
                return;
        }

        if (el.hasOwnProperty('stopMoving') && el.hasOwnProperty('maxMove')) {
            if ((Math.abs(el.pos.targetY)*el.speed < el.maxMove) && e.deltaY <= 0) {
                    this.verticalMove = self.els[0].pos.targetY; // record the targetY point of main section when this section stops moving
            }
            if ((Math.abs(el.pos.targetY)*el.speed > el.maxMove) && e.deltaY <= 0) {
                return; // stop moving the section if still going up
            }
            if (el.hasOwnProperty('stopMoving') && e.deltaY > 0 && this.verticalMove >= self.els[0].pos.targetY) {
                return; // stop moving the section while going down until it crosses the recorded point where it stopped
            }
        }

        if (el.hasOwnProperty('stopMoving') && el.hasOwnProperty('maxMoveRatio')) {
            if ((Math.abs(el.pos.targetY)*el.speed < (el.maxMoveRatio * self.windowHeight)) && e.deltaY <= 0) {
                    this.verticalMoveRatio = self.els[0].pos.targetY; // record the targetY point of main section when this section stops moving
            }
            if ((Math.abs(el.pos.targetY)*el.speed > (el.maxMoveRatio * self.windowHeight)) && e.deltaY <= 0) {
                return; // stop moving the section if still going up
            }
            if (el.hasOwnProperty('stopMoving') && e.deltaY > 0 && this.verticalMoveRatio >= self.els[0].pos.targetY) {
                return; // stop moving the section while going down until it crosses the recorded point where it stopped
            }
        }

        el.pos.targetY += e.deltaY;
        el.pos.targetX += e.deltaX;

        el.pos.targetY = Math.max(self.boundingPos * -1, el.pos.targetY); 
        el.pos.targetY = Math.min(0, el.pos.targetY);


        el.pos.targetX = Math.max(self.boundingPos * -1, el.pos.targetX);
        el.pos.targetX = Math.min(0, el.pos.targetX);    
    });

    if (self.destroyed) {
        this.ui.newOpacities = self.storeLastOpacities;
        self.destroyed = false;
    }
    else {
      this.ui.newOpacities = this.calcOpacity();
    }
};

Smooth.prototype.build = function(){
    
    var self = this;
    var prop = (this.direction == 'vertical')
        ? "height"
        : "width";

    if(this.scrollbar.active){
        var body = document.body;
        var parent = this.scrollbar.el;
        var el = this.scrollbar.drag.el;
        el.style.height = this.scrollbar.drag.height + 'px';
        // classes

        if(!parent.classList.contains('vs-scrollbar')) {
            var parentClassNames = parent.className;
            var elClassNames = el.className;
            parent.className = parentClassNames + " vs-scrollbar vs-" + this.direction;
            el.className = elClassNames + " vs-scrolldrag";
        }


        // style
        body.style.userSelect = 'none';
        parent.style.backgroundColor = this.scrollbar.bg;
        el.style.backgroundColor = this.scrollbar.main;


        // append to DOM
        this.section.parentNode.insertBefore(parent, this.section.nextSibling);
        parent.appendChild(el);

        // events
        document.addEventListener('mousemove', this.move);
        el.addEventListener('mousedown', this.down);
        parent.addEventListener('click', this.calcScroll);

    }

};

Smooth.prototype.calcOpacity = function() {
    var newOpacities = [];

    this.opacityPoints.forEach(function(elem, index) {
        newOpacities[index] = Math.max( elem.endOpacity, (1 - (elem.topOffset - parseInt(elem.element.getBoundingClientRect().top))/elem.topOffset*elem.factor));
    });
    return newOpacities;
};

Smooth.prototype.down = function(e) {

    var self = this;

    this.scrollbar.drag.clicked = true;
    this.disableTextSelectionWhileDrag(this.scrollbar.drag.clicked);
    document.addEventListener('mouseup', this.up);
};

Smooth.prototype.up = function() {
    this.scrollbar.drag.clicked = false;
    this.disableTextSelectionWhileDrag(this.scrollbar.drag.clicked);
};

Smooth.prototype.disableTextSelectionWhileDrag = function (scrollbarClicked) {
    if (scrollbarClicked) {
        if (!(document.body.classList.contains("disable_text_selection"))) {
            document.body.classList = this.bodyKlass.add("disable_text_selection");
        }
    }
    else {
         document.body.classList = this.bodyKlass.remove("disable_text_selection");
    }
};

Smooth.prototype.move = function(e) {
    //this.scrollbar.drag.clicked && this.calcScroll(e);
    if (this.destroyed) {
        this.clientYpos = this.storeLastClientY;
    }
    if (this.scrollbar.drag.clicked) {
        var clientY = e.clientY;
        clientY = clientY > this.windowHeight? this.windowHeight : clientY;
        clientY = clientY < 0? 0 : clientY;
        if (clientY >= this.clientYpos) {
            e.deltaY = - ((clientY - this.clientYpos)/(this.windowHeight - this.scrollbar.drag.height) * this.boundingPos);
        }
        else {
            e.deltaY = ((this.clientYpos - clientY)/(this.windowHeight - this.scrollbar.drag.height) * this.boundingPos);
        }
        this.clientYpos = clientY;
        this.calculateYpos(e);

    }
};

Smooth.prototype.showCustomScroll =  function (self) {
    var klasses = self.scrollbar.drag.el.className;
    self.scrollbar.drag.el.className = "vs-scrolldrag show_scrollbar";
    var lastTimeMouseMoved = new Date().getTime();
    var t=setTimeout(function(){
        var currentTime = new Date().getTime();
        if(currentTime - lastTimeMouseMoved > 3000) {
            clearTimeout(t);
            self.scrollbar.drag.el.className = "vs-scrolldrag";
        }
    },3000);
}
Smooth.prototype.calcScroll = function(e) {
    var self = this;
    this.scrollYpos = e.y;
    if (self.direction == 'vertical') {
        self.scrollbar.drag.deltaY = e.y * self.scrollbar.drag.speed;
        self.pos.targetY = -self.scrollbar.drag.deltaY;
        self.pos.targetY = Math.max(self.bounding * -1, self.pos.targetY);
        self.pos.targetY = Math.min(0, self.pos.targetY);
        self.clientYpos = self.scrollbar.drag.el.getBoundingClientRect().top + self.scrollbar.drag.height/2;
    }
    else {
        self.scrollbar.drag.deltaX = e.clientX / (self.scrollbar.drag.speed + 2);

        self.pos.targetX = -self.scrollbar.drag.deltaX;
        self.pos.targetX = Math.max(self.bounding * -1, self.pos.targetX);
        self.pos.targetX = Math.min(0, self.pos.targetX);
    }
    //this.showCustomScroll(this);

};

Smooth.prototype.run = function () {

    var self = this;
    var t, s, v, b, r, h;

    this.pos.currentY += (this.pos.targetY - this.pos.currentY) * this.ease;
    this.pos.currentX += (this.pos.targetX - this.pos.currentX) * this.ease;

    this.els.forEach(function(el, index) {
            var elSpeed = el.speed;

            el.pos.currentY += (el.pos.targetY - el.pos.currentY) * self.ease;
            el.pos.currentX += (el.pos.targetX - el.pos.currentX) * self.ease;

            t = (self.direction == 'vertical')
                ? 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,' + (el.pos.currentY * elSpeed).toFixed(2) + ',0,1)'
                : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,' + (el.pos.currentX * elSpeed).toFixed(2) + ',0,0,1)'
            s = el.element.style;
            s['webkitTransform'] = t;
            s['msTransform'] = t;
            s.transform = t; 

            if (!el.hasOwnProperty('isolatedMovement')) { // element not moving continuosly cant be cosidered for getting bounding position
                self.extraMove = el.pos.currentY * elSpeed;
                if (self.stickySection.stickAfter > - self.extraMove) {
                    self.stickySection.element.style.transform = t;
                }
                if (-self.extraMove > self.stickySection.stickAfter) {
                    var matrix3D = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0,'+ - self.stickySection.stickAfter + ', 0, 1)';
                    var elementStyle = self.stickySection.element.style;
                    elementStyle['webkitTransform'] = matrix3D;
                    elementStyle['msTransform'] = matrix3D;
                    elementStyle['transform'] = matrix3D;
                    
                }
            }

            if ((-self.extraMove <= 1) && self.isSmartPhonesOrTablet) {
                self.stickySection.element.style.transform = 'none';
                self.stickySection.element.style.webkitTransform = 'none';
            }
    });
    this.opacityPoints.forEach(function (elem, index) {
         elem.element.style.opacity = self.ui.newOpacities[index];
    })

    if(this.scrollbar.active) {

        h = self.scrollbar.drag.height;
        r = (self.direction == 'vertical')
            ? (Math.abs(self.els[0].pos.currentY) / (self.boundingPos / (self.windowHeight - h))) + (h / .5) - h
            : (Math.abs(self.pos.currentX) / (self.bounding / (window.innerWidth - h))) + (h / .5) - h

        r = Math.max(0, r-h);
        r = Math.min(r, r+h);

        v = (self.direction == 'vertical')
            ? 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,0,'  + r.toFixed(2) +  ',0,1)'
            : 'matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,'  + r.toFixed(2) +   ',0,0,1)'
        g = self.scrollbar.drag.el.style;
        g['webkitTransform'] = v; 
        g['msTransform'] = v;
        g.transform = v;
    }
    this.rAF = requestAnimationFrame(this.run.bind(this));

};

Smooth.prototype.getTo = function (self, el) {

    if(this.direction == 'vertical') this.pos.targetY = -el.target.targetPos;
    else this.pos.targetX = -el.target.targetPos;
    
};

Smooth.prototype.scrollTo = function (offset) {
    if(this.direction == 'vertical') this.pos.targetY = -offset;
    else this.pos.targetX = -offset;
    
};

Smooth.prototype.resize = function() {

    this.bounding = (this.direction == 'vertical')
        ? this.section.getBoundingClientRect().height - window.innerHeight
        : this.section.getBoundingClientRect().left + this.section.getBoundingClientRect().right - window.innerHeight;

};

Smooth.prototype.resetTransform = function (el) {
    var elemeStyle = el.style;
    elemeStyle['webkitTransform'] = 'none';
    elemeStyle['msTransform'] = 'none';
    elemeStyle.transform = 'none'; 
};

Smooth.prototype.destroy = function() {
    var self = this;
    this.ui.newOpacities = [];
    vs.off(this.calc);
    vs.off(this.calcOpacity);
    
    self.storeLastOpacities = this.ui.newOpacities;
    self.storeLastClientY = this.clientYpos;
    self.destroyed = true;

    cancelAnimationFrame(this.rAF);
    this.rAF = undefined;
    
    this.to.forEach(function(el) {
        el.removeEventListener('click', self.getTo);
    });
    this.els.forEach(function(el) {
        self.resetTransform(el.element);
    });

    if (window.innerWidth <= 1000) {
        this.opacityPoints.forEach(function(elem) {
            elem.element.style.opacity = 1;  
        });
    }
    this.resetTransform(this.stickySection.element);


    document.removeEventListener('touchmove', this.prevent);
    window.removeEventListener('resize', this.resize);

    if (this.scrollbar.active) {
        this.scrollbar.el.removeEventListener('click', this.calcScroll);
        this.scrollbar.drag.el.removeEventListener('mousedown', this.down);
        document.removeEventListener('mousemove', this.move);
        document.removeEventListener('mouseup', this.up);
    }

};
