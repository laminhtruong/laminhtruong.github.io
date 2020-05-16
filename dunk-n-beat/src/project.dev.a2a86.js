window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Basket: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "815f1p5tUxEPpUClQqzft+a", "Basket");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Input_1 = require("./core/Input");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var STATE;
    (function(STATE) {
      STATE[STATE["NONE"] = 0] = "NONE";
      STATE[STATE["INIT"] = 1] = "INIT";
      STATE[STATE["UPDATE"] = 2] = "UPDATE";
    })(STATE || (STATE = {}));
    var Basket = function(_super) {
      __extends(Basket, _super);
      function Basket() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.Group = null;
        return _this;
      }
      Basket.prototype.onLoad = function() {};
      Basket.prototype.start = function() {};
      Basket.prototype.setState = function(state) {
        this.mState = state;
        switch (this.mState) {
         case STATE.NONE:
         case STATE.INIT:
         case STATE.UPDATE:
        }
      };
      Basket.prototype.update = function(dt) {
        if (Input_1.default.instance.isHold) {
          var x = cc.misc.lerp(this.node.position.x, this.node.position.x + Input_1.default.instance.delta.x, dt);
          x = cc.misc.clampf(x, -3, 3);
          this.node.setPosition(x, this.node.position.y, this.node.position.z);
        }
      };
      __decorate([ property(cc.Node) ], Basket.prototype, "Group", void 0);
      Basket = __decorate([ ccclass ], Basket);
      return Basket;
    }(cc.Component);
    exports.default = Basket;
    cc._RF.pop();
  }, {
    "./core/Input": "Input"
  } ],
  Input: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c8e82i82hREtYEG+SvmQHP6", "Input");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Input = function(_super) {
      __extends(Input, _super);
      function Input() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.position = new cc.Vec2(0, 0);
        _this.prevPosition = new cc.Vec2(0, 0);
        _this.delta = new cc.Vec2(0, 0);
        _this.isHold = false;
        return _this;
      }
      Input_1 = Input;
      Input.prototype.onLoad = function() {
        Input_1.instance = this;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
      };
      Input.prototype.start = function() {};
      Input.prototype.update = function(dt) {
        if (this.isHold) {
          cc.Vec2.subtract(this.delta, this.position, this.prevPosition);
          this.prevPosition = this.position;
        }
      };
      Input.prototype.onTouchStart = function(event) {
        this.position = event.touch.getLocation();
        this.prevPosition = event.touch.getLocation();
        this.isHold = true;
      };
      Input.prototype.onTouchEnd = function(event) {
        this.delta = new cc.Vec2(0, 0);
        this.isHold = false;
      };
      Input.prototype.onTouchMove = function(event) {
        this.position = event.touch.getLocation();
      };
      var Input_1;
      Input.instance = null;
      Input = Input_1 = __decorate([ ccclass ], Input);
      return Input;
    }(cc.Component);
    exports.default = Input;
    cc._RF.pop();
  }, {} ]
}, {}, [ "Basket", "Input" ]);