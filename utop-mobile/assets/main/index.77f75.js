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
  API: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "519a1UFF4ZBy4cfQ0vO+vLe", "API");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ccclass = cc._decorator.ccclass;
    var API = function() {
      function API() {}
      API_1 = API;
      API.Request = function(method, url, body) {
        var userParams = window.userParams;
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, userParams.api + url, true);
          xhr.setRequestHeader("Content-type", "application/json");
          xhr.onreadystatechange = function() {
            4 == xhr.readyState && (200 == xhr.status ? resolve(xhr.response) : reject(xhr.response));
          };
          xhr.send(body);
        });
      };
      API.StartGame = function(gamecode, channel, session) {
        var body = {
          idChannel: channel || 1,
          gamecode: gamecode || 1,
          sessionID: session || 1
        };
        return API_1.Request("post", "/StartGame", JSON.stringify(body));
      };
      API.EndGame = function(transaction, session, score) {
        var body = {
          idTrans: transaction,
          sessionID: session,
          score: score
        };
        return API_1.Request("post", "/EndGame", JSON.stringify(body));
      };
      API.GetTime = function() {
        return API_1.Request("post", "/GetTimeStamp", null);
      };
      var API_1;
      API = API_1 = __decorate([ ccclass ], API);
      return API;
    }();
    exports.default = API;
    cc._RF.pop();
  }, {} ],
  CollectibleMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cc4e1VIjdNCQZWkEeLAggyG", "CollectibleMgr");
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
    var Defines_1 = require("./Defines");
    var Collectible_1 = require("./Collectible");
    var Timer_1 = require("./core/Timer");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var STATE;
    (function(STATE) {
      STATE[STATE["INIT"] = 0] = "INIT";
      STATE[STATE["PLAYING"] = 1] = "PLAYING";
      STATE[STATE["DEAD"] = 2] = "DEAD";
    })(STATE || (STATE = {}));
    var CollectibleMgr = function(_super) {
      __extends(CollectibleMgr, _super);
      function CollectibleMgr() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.collectiblePrefab = null;
        _this.collectibles = [];
        _this.timerSpawn = new Timer_1.default();
        _this.waveIndex = 0;
        return _this;
      }
      CollectibleMgr.prototype.start = function() {
        this.timerSpawn.SetDuration(1);
      };
      CollectibleMgr.prototype.update = function(dt) {
        if (cc.game.isPaused()) return;
        switch (this.state) {
         case STATE.INIT:
          break;

         case STATE.PLAYING:
          this.timerSpawn.Update(dt);
          if (this.CanSpawn()) {
            this.waveIndex % 5 == 4 ? this.SpawnFood(Defines_1.CollectibleType.MENU, cc.Camera.main.node.position.x + cc.winSize.width + 100, cc.winSize.height / 2 + Defines_1.RandomInt(-150, 150)) : this.SpawnFood(Defines_1.RandomInt(Defines_1.CollectibleType.BOBA, Defines_1.CollectibleType.STEAK), cc.Camera.main.node.position.x + cc.winSize.width + 100, cc.winSize.height / 2 + Defines_1.RandomInt(-150, 150));
            this.waveIndex++;
          }
          break;

         case STATE.DEAD:
        }
      };
      CollectibleMgr.prototype.SetState = function(state) {
        this.state = state;
        switch (state) {
         case STATE.INIT:
          if (0 == this.collectibles.length) for (var i = 0; i < Defines_1.default.COLLECTIBLE_MAX; i++) {
            var collectible = cc.instantiate(this.collectiblePrefab);
            collectible.parent = this.node;
            collectible.active = false;
            this.collectibles.push(collectible);
          } else for (var i = 0; i < Defines_1.default.COLLECTIBLE_MAX; i++) this.collectibles[i].active = false;
          this.waveIndex = 0;
          break;

         case STATE.PLAYING:
         case STATE.DEAD:
        }
      };
      CollectibleMgr.prototype.Init = function() {
        this.SetState(STATE.INIT);
      };
      CollectibleMgr.prototype.Play = function() {
        this.SetState(STATE.PLAYING);
      };
      CollectibleMgr.prototype.Reset = function() {
        this.waveIndex = 0;
        for (var i = 0; i < Defines_1.default.COLLECTIBLE_MAX; i++) this.collectibles[i].active = false;
      };
      CollectibleMgr.prototype.CanSpawn = function() {
        var canSpawn = this.collectibles.every(function(collectible) {
          return !collectible.active;
        });
        if (!canSpawn) {
          var sorted = this.collectibles.filter(function(Collectible) {
            return Collectible.active;
          }).map(function(collectible) {
            return collectible.position.x - cc.Camera.main.node.position.x;
          }).sort(function(a, b) {
            return b - a;
          });
          sorted.length > 0 && (canSpawn = sorted[0] < cc.winSize.width / 2);
        }
        return canSpawn;
      };
      CollectibleMgr.prototype.Spawn = function(type, x, y, scale) {
        var collectible = this.GetInactiveCollectible();
        if (null != collectible) {
          collectible.setScale(scale, scale);
          collectible.getComponent(Collectible_1.default).Spawn(type, x, y, 0);
        }
      };
      CollectibleMgr.prototype.SpawnAlphaB = function(char, type, x, y) {
        var _this = this;
        var charArray = Defines_1.AlphaB[char];
        y += Defines_1.default.GRID_HEIGHT * charArray.length / 2;
        charArray.forEach(function(rows, rowIndex) {
          rows.forEach(function(value, colIndex) {
            if (1 == value) {
              var itemX = x + colIndex * Defines_1.default.GRID_WIDTH;
              var itemY = y - rowIndex * Defines_1.default.GRID_HEIGHT;
              _this.Spawn(type, itemX, itemY, .2);
            }
          });
        });
        return charArray[0].length * Defines_1.default.GRID_WIDTH;
      };
      CollectibleMgr.prototype.SpawnText = function(text, type, x, y) {
        var _this = this;
        var spacing = 35;
        var startX = x;
        text.split("").forEach(function(char) {
          " " != char && (x += _this.SpawnAlphaB(char, type, x, y));
          x += spacing;
        });
        return x - startX;
      };
      CollectibleMgr.prototype.SpawnSymbol = function(symbol, type, x, y) {
        var _this = this;
        var charArray = Defines_1.Symbols[symbol];
        y += Defines_1.default.GRID_HEIGHT * charArray.length / 2;
        charArray.forEach(function(rows, rowIndex) {
          rows.forEach(function(value, colIndex) {
            if (1 == value) {
              var itemX = x + colIndex * Defines_1.default.GRID_HEIGHT;
              var itemY = y - rowIndex * Defines_1.default.GRID_HEIGHT;
              _this.Spawn(type, itemX, itemY, .1);
            }
          });
        });
        return charArray[0].length * Defines_1.default.GRID_HEIGHT;
      };
      CollectibleMgr.prototype.SpawnFood = function(type, x, y) {
        var name = [ "TRA SUA", "BUN BO", "BURGER", "PLAN", "PIZZA", "MI Y", "STEAK", "UTOP" ];
        var w = this.SpawnText(name[type], type, x, y - 90);
        this.Spawn(type, x + w / 2, y + 90, Defines_1.default.COLLECTIBLE_SCALE);
      };
      CollectibleMgr.prototype.Dead = function() {
        this.SetState(STATE.DEAD);
      };
      CollectibleMgr.prototype.GetInactiveCollectible = function() {
        for (var i = 0; i < Defines_1.default.COLLECTIBLE_MAX; i++) {
          var collectible = this.collectibles[i].getComponent(Collectible_1.default);
          if (collectible.IsHidden()) return this.collectibles[i];
        }
        return null;
      };
      __decorate([ property({
        type: cc.Prefab
      }) ], CollectibleMgr.prototype, "collectiblePrefab", void 0);
      CollectibleMgr = __decorate([ ccclass ], CollectibleMgr);
      return CollectibleMgr;
    }(cc.Component);
    exports.default = CollectibleMgr;
    cc._RF.pop();
  }, {
    "./Collectible": "Collectible",
    "./Defines": "Defines",
    "./core/Timer": "Timer"
  } ],
  Collectible: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fa348NaP0ZPiLsfr/XupaJH", "Collectible");
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
    var Defines_1 = require("./Defines");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var STATE;
    (function(STATE) {
      STATE[STATE["PLAYING"] = 0] = "PLAYING";
      STATE[STATE["FOLLOWING"] = 1] = "FOLLOWING";
      STATE[STATE["HIDE"] = 2] = "HIDE";
    })(STATE || (STATE = {}));
    var Collectible = function(_super) {
      __extends(Collectible, _super);
      function Collectible() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.animation = null;
        _this.foods = [];
        _this.type = Defines_1.CollectibleType.BOBA;
        _this.speed = 0;
        _this.isCollected = false;
        return _this;
      }
      Collectible.prototype.update = function(dt) {
        switch (this.state) {
         case STATE.PLAYING:
          var cameraPosition = cc.Camera.main.node.position;
          this.node.setPosition(this.node.position.subtract(cc.v3(this.speed * Defines_1.default.GAME_BASE_SPEED * dt, 0, 0)));
          this.node.position.x - cameraPosition.x < -cc.winSize.width / 2 && this.SetState(STATE.HIDE);
          break;

         case STATE.FOLLOWING:
          this.node.setPosition(this.node.position.lerp(this.player.node.position, .1 * Defines_1.default.GAME_BASE_SPEED * dt));
          break;

         case STATE.HIDE:
        }
      };
      Collectible.prototype.onCollected = function() {
        this.node.active = false;
      };
      Collectible.prototype.SetState = function(state) {
        this.state = state;
        switch (state) {
         case STATE.PLAYING:
          this.isCollected = false;
          this.node.active = true;
          break;

         case STATE.HIDE:
          this.node.active = false;
        }
      };
      Collectible.prototype.SetFood = function(type) {
        this.type = type;
        for (var i = 0; i < this.foods.length; i++) this.foods[i].node.active = i == type;
      };
      Collectible.prototype.Spawn = function(type, x, y, speed) {
        void 0 === speed && (speed = 0);
        this.speed = speed;
        this.node.setPosition(x, y);
        this.node.active = true;
        this.SetFood(type);
        this.animation.stop();
        this.animation.play("idle");
        this.SetState(STATE.PLAYING);
      };
      Collectible.prototype.Collect = function() {
        if (this.isCollected) return;
        this.isCollected = true;
        this.animation.play("collect");
        this.node.scale == Defines_1.default.COLLECTIBLE_SCALE && this.node.getComponent(cc.AudioSource).play();
      };
      Collectible.prototype.Follow = function(player) {
        if (this.state != STATE.FOLLOWING) {
          this.player = player;
          this.SetState(STATE.FOLLOWING);
        }
      };
      Collectible.prototype.Hide = function() {
        this.isCollected || (this.node.active = false);
      };
      Collectible.prototype.IsHidden = function() {
        return !this.node.active;
      };
      __decorate([ property({
        type: cc.Animation
      }) ], Collectible.prototype, "animation", void 0);
      __decorate([ property({
        type: [ cc.Sprite ]
      }) ], Collectible.prototype, "foods", void 0);
      Collectible = __decorate([ ccclass ], Collectible);
      return Collectible;
    }(cc.Component);
    exports.default = Collectible;
    cc._RF.pop();
  }, {
    "./Defines": "Defines"
  } ],
  Defines: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a49cbvPOuxAKauT+47PnPv4", "Defines");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Symbols = exports.AlphaB = exports.CollectibleType = exports.CollisionTag = exports.GameEvent = exports.RandomInt = exports.Clamp = void 0;
    exports.default = new (function() {
      function Config() {
        this.GAME_BASE_SPEED = 60;
        this.GAME_TIMEOUT = 60;
        this.GAME_RESULT_TIMEOUT = 5;
        this.GAME_SPEED_MIN = 5;
        this.GAME_SPEED_MAX = 7;
        this.COLLECTIBLE_SCALE = .8;
        this.COLLECTIBLE_MAX = 200;
        this.ROCKET_MAX = 5;
        this.GRID_WIDTH = 20;
        this.GRID_HEIGHT = 25;
        this.QR_REFRESH_RATE = 270;
        this.USE_SIMPLE_FACE_DETECT = true;
      }
      return Config;
    }())();
    function Clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
    exports.Clamp = Clamp;
    function RandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    exports.RandomInt = RandomInt;
    var GameEvent;
    (function(GameEvent) {
      GameEvent["TOUCH"] = "TouchEvent";
      GameEvent["COLLECT_ITEM"] = "CollectItem";
      GameEvent["PLAYER_HURT"] = "PlayerHurt";
      GameEvent["LOSE"] = "GameLose";
    })(GameEvent = exports.GameEvent || (exports.GameEvent = {}));
    var CollisionTag;
    (function(CollisionTag) {
      CollisionTag[CollisionTag["COLLECTIBLE"] = 0] = "COLLECTIBLE";
      CollisionTag[CollisionTag["ROCKET"] = 1] = "ROCKET";
      CollisionTag[CollisionTag["EVIL"] = 2] = "EVIL";
    })(CollisionTag = exports.CollisionTag || (exports.CollisionTag = {}));
    var CollectibleType;
    (function(CollectibleType) {
      CollectibleType[CollectibleType["BOBA"] = 0] = "BOBA";
      CollectibleType[CollectibleType["BUNBO"] = 1] = "BUNBO";
      CollectibleType[CollectibleType["BURGER"] = 2] = "BURGER";
      CollectibleType[CollectibleType["PLAN"] = 3] = "PLAN";
      CollectibleType[CollectibleType["PIZZA"] = 4] = "PIZZA";
      CollectibleType[CollectibleType["SPAGHETTI"] = 5] = "SPAGHETTI";
      CollectibleType[CollectibleType["STEAK"] = 6] = "STEAK";
      CollectibleType[CollectibleType["MENU"] = 7] = "MENU";
    })(CollectibleType = exports.CollectibleType || (exports.CollectibleType = {}));
    exports.AlphaB = {
      A: [ [ 0, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 1, 1, 1, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ] ],
      B: [ [ 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 1, 1, 1, 0 ] ],
      C: [ [ 0, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 0 ], [ 1, 0, 0, 0, 1 ], [ 0, 1, 1, 1, 0 ] ],
      D: [ [ 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 1, 1, 1, 0 ] ],
      E: [ [ 1, 1, 1, 1, 1 ], [ 1, 0, 0, 0, 0 ], [ 1, 1, 1, 0, 0 ], [ 1, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 1 ] ],
      F: [ [ 1, 1, 1, 1, 1 ], [ 1, 0, 0, 0, 0 ], [ 1, 1, 1, 0, 0 ], [ 1, 0, 0, 0, 0 ], [ 1, 0, 0, 0, 0 ] ],
      G: [ [ 0, 1, 1, 1, 1 ], [ 1, 0, 0, 0, 0 ], [ 1, 0, 1, 1, 1 ], [ 1, 0, 0, 0, 1 ], [ 0, 1, 1, 1, 1 ] ],
      H: [ [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 1, 1, 1, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ] ],
      I: [ [ 1, 1, 1, 1, 1 ], [ 0, 0, 1, 0, 0 ], [ 0, 0, 1, 0, 0 ], [ 0, 0, 1, 0, 0 ], [ 1, 1, 1, 1, 1 ] ],
      J: [ [ 1, 1, 1, 1, 1 ], [ 0, 0, 1, 0, 0 ], [ 0, 0, 1, 0, 0 ], [ 1, 0, 1, 0, 0 ], [ 0, 1, 1, 0, 0 ] ],
      K: [ [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 1, 0 ], [ 1, 1, 1, 0, 0 ], [ 1, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 1 ] ],
      L: [ [ 1, 0, 0, 0, 0 ], [ 1, 0, 0, 0, 0 ], [ 1, 0, 0, 0, 0 ], [ 1, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 1 ] ],
      M: [ [ 1, 0, 0, 0, 1 ], [ 1, 1, 0, 1, 1 ], [ 1, 0, 1, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ] ],
      N: [ [ 1, 0, 0, 0, 1 ], [ 1, 1, 0, 0, 1 ], [ 1, 0, 1, 0, 1 ], [ 1, 0, 0, 1, 1 ], [ 1, 0, 0, 0, 1 ] ],
      O: [ [ 0, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 0, 1, 1, 1, 0 ] ],
      P: [ [ 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 0 ] ],
      Q: [ [ 0, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 1, 1 ], [ 0, 1, 1, 1, 1 ] ],
      R: [ [ 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 1, 1, 1, 0 ], [ 1, 0, 0, 0, 1 ] ],
      S: [ [ 0, 1, 1, 1, 1 ], [ 1, 0, 0, 0, 0 ], [ 1, 1, 1, 1, 1 ], [ 0, 0, 0, 0, 1 ], [ 1, 1, 1, 1, 0 ] ],
      T: [ [ 1, 1, 1, 1, 1 ], [ 0, 0, 1, 0, 0 ], [ 0, 0, 1, 0, 0 ], [ 0, 0, 1, 0, 0 ], [ 0, 0, 1, 0, 0 ] ],
      U: [ [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 0, 1, 1, 1, 0 ] ],
      V: [ [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 0, 1, 0, 1, 0 ], [ 0, 1, 0, 1, 0 ], [ 0, 0, 1, 0, 0 ] ],
      W: [ [ 1, 0, 0, 0, 1 ], [ 1, 0, 0, 0, 1 ], [ 1, 0, 1, 0, 1 ], [ 1, 0, 1, 0, 1 ], [ 0, 1, 0, 1, 0 ] ],
      X: [ [ 1, 0, 0, 0, 1 ], [ 0, 1, 0, 1, 0 ], [ 0, 0, 1, 0, 0 ], [ 0, 1, 0, 1, 0 ], [ 1, 0, 0, 0, 1 ] ],
      Y: [ [ 1, 0, 0, 0, 1 ], [ 0, 1, 0, 1, 0 ], [ 0, 0, 1, 0, 0 ], [ 0, 0, 1, 0, 0 ], [ 0, 0, 1, 0, 0 ] ],
      Z: [ [ 1, 1, 1, 1, 1 ], [ 0, 0, 0, 1, 0 ], [ 0, 0, 1, 0, 0 ], [ 0, 1, 0, 0, 0 ], [ 1, 1, 1, 1, 1 ] ]
    };
    exports.Symbols = {
      arrow: [ [ 0, 0, 0, 1, 0, 0 ], [ 0, 0, 0, 1, 1, 0 ], [ 1, 1, 1, 1, 1, 1 ], [ 1, 1, 1, 1, 1, 1 ], [ 0, 0, 0, 1, 1, 0 ], [ 0, 0, 0, 1, 0, 0 ] ],
      square: [ [ 1, 1, 1, 1, 1, 1 ], [ 1, 1, 1, 1, 1, 1 ], [ 1, 1, 0, 0, 1, 1 ], [ 1, 1, 0, 0, 1, 1 ], [ 1, 1, 1, 1, 1, 1 ], [ 1, 1, 1, 1, 1, 1 ] ],
      triangle: [ [ 0, 0, 0, 1, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 0, 0 ], [ 0, 1, 1, 1, 1, 1, 0 ], [ 1, 1, 1, 1, 1, 1, 1 ] ],
      diamond: [ [ 0, 0, 0, 1, 0, 0, 0 ], [ 0, 0, 1, 1, 1, 0, 0 ], [ 0, 1, 1, 1, 1, 1, 0 ], [ 1, 1, 1, 1, 1, 1, 1 ], [ 0, 1, 1, 1, 1, 1, 0 ], [ 0, 0, 1, 1, 1, 0, 0 ], [ 0, 0, 0, 1, 0, 0, 0 ] ],
      zigzagw: [ [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1 ], [ 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0 ], [ 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0 ], [ 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 ], [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ] ],
      zigzagm: [ [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ], [ 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 ], [ 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0 ], [ 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0 ], [ 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1 ] ]
    };
    cc._RF.pop();
  }, {} ],
  EventMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f8ad5rydN9EIZ62nOSFY4Dg", "EventMgr");
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
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.EventMgr = void 0;
    var EventMgr = function(_super) {
      __extends(EventMgr, _super);
      function EventMgr() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      EventMgr.instance = null;
      return EventMgr;
    }(cc.EventTarget);
    exports.EventMgr = EventMgr;
    EventMgr.instance = new EventMgr();
    cc._RF.pop();
  }, {} ],
  Evil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fbb52MKdNBJgpfpJ8Q5p3TY", "Evil");
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
    var Defines_1 = require("./Defines");
    var Timer_1 = require("./core/Timer");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var STATE;
    (function(STATE) {
      STATE[STATE["IDLE"] = 0] = "IDLE";
      STATE[STATE["FLY"] = 1] = "FLY";
      STATE[STATE["FLY_OUT"] = 2] = "FLY_OUT";
      STATE[STATE["WAITING"] = 3] = "WAITING";
    })(STATE || (STATE = {}));
    var Evil = function(_super) {
      __extends(Evil, _super);
      function Evil() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.timerWaiting = new Timer_1.default();
        _this.angle = 0;
        _this.dir = 1;
        return _this;
      }
      Evil.prototype.start = function() {
        this.SetState(STATE.IDLE);
      };
      Evil.prototype.update = function(dt) {
        switch (this.state) {
         case STATE.IDLE:
          break;

         case STATE.WAITING:
          this.timerWaiting.Update(dt);
          this.timerWaiting.IsDone() && this.SetState(STATE.IDLE);
          break;

         case STATE.FLY:
          this.dir > 0 ? this.angle > 1440 && this.SetState(STATE.FLY_OUT) : this.angle < -1260 && this.SetState(STATE.FLY_OUT);
          this.center = this.center.lerp(this.target.position, dt);
          this.center.x += Defines_1.default.GAME_SPEED_MIN * Defines_1.default.GAME_BASE_SPEED * dt;
          this.UpdateFly(dt);
          break;

         case STATE.FLY_OUT:
          this.center = this.center.lerp(cc.v3(this.target.position.x - cc.winSize.width / 2, this.target.position.y, 0), dt / 5);
          this.center.x += Defines_1.default.GAME_SPEED_MIN / 2 * Defines_1.default.GAME_BASE_SPEED * dt;
          this.UpdateFly(dt);
          this.IsOutOfScreen() && this.Waiting(1);
        }
      };
      Evil.prototype.SetState = function(state) {
        this.state = state;
        switch (this.state) {
         case STATE.IDLE:
         case STATE.FLY:
        }
      };
      Evil.prototype.Waiting = function(time) {
        this.timerWaiting.SetDuration(time);
        this.SetState(STATE.WAITING);
      };
      Evil.prototype.Fly = function(target, dir, center) {
        this.target = target;
        this.center = center;
        this.dir = dir;
        this.angle = dir > 0 ? 0 : 180;
        this.SetState(STATE.FLY);
      };
      Evil.prototype.FlyOut = function() {
        this.state == STATE.FLY && this.SetState(STATE.FLY_OUT);
      };
      Evil.prototype.Dead = function() {
        this.SetState(STATE.IDLE);
      };
      Evil.prototype.IsOutOfScreen = function() {
        var cameraPosition = cc.Camera.main.node.position;
        return this.node.position.x - cameraPosition.x < 0;
      };
      Evil.prototype.UpdateFly = function(dt) {
        var w = 350;
        var h = 200;
        this.angle += this.dir * Defines_1.default.GAME_BASE_SPEED * dt;
        var x = Math.cos(this.angle * Math.PI / 180) * w;
        var y = Math.sin(this.angle * Math.PI / 180) * h;
        this.node.setPosition(cc.v3(this.center.x + x, this.center.y + y, 0));
      };
      Evil = __decorate([ ccclass ], Evil);
      return Evil;
    }(cc.Component);
    exports.default = Evil;
    cc._RF.pop();
  }, {
    "./Defines": "Defines",
    "./core/Timer": "Timer"
  } ],
  GameMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "15fb3AUZERDaaRXtnJ70/ub", "GameMgr");
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
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventMgr_1 = require("./core/EventMgr");
    var Defines_1 = require("./Defines");
    var Player_1 = require("./Player");
    var Input_1 = require("./core/Input");
    var MainMenu_1 = require("./ui/MainMenu");
    var Ingame_1 = require("./ui/Ingame");
    var Score_1 = require("./ui/Score");
    var Settings_1 = require("./Settings");
    var Loading_1 = require("./ui/Loading");
    var Timer_1 = require("./core/Timer");
    var VideoCamera_1 = require("./camera/VideoCamera");
    var ML5Wrapper_1 = require("./ml5/ML5Wrapper");
    var CollectibleMgr_1 = require("./CollectibleMgr");
    var SimpleFaceDetect_1 = require("./SimpleFaceDetect");
    var ObstacleMgr_1 = require("./ObstacleMgr");
    var API_1 = require("./API");
    var Message_1 = require("./Message");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var STATE;
    (function(STATE) {
      STATE[STATE["INIT"] = 0] = "INIT";
      STATE[STATE["TOUCH_TO_PLAY"] = 1] = "TOUCH_TO_PLAY";
      STATE[STATE["COUNTDOWN"] = 2] = "COUNTDOWN";
      STATE[STATE["PLAYING"] = 3] = "PLAYING";
      STATE[STATE["PAUSE"] = 4] = "PAUSE";
      STATE[STATE["RESUME"] = 5] = "RESUME";
      STATE[STATE["WIN_DELAY"] = 6] = "WIN_DELAY";
      STATE[STATE["WIN"] = 7] = "WIN";
      STATE[STATE["LOSE_DELAY"] = 8] = "LOSE_DELAY";
      STATE[STATE["LOSE"] = 9] = "LOSE";
    })(STATE || (STATE = {}));
    var GameMgr = function(_super) {
      __extends(GameMgr, _super);
      function GameMgr() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.obstacleMgr = null;
        _this.collectibleMgr = null;
        _this.viewMainMenu = null;
        _this.viewIngame = null;
        _this.viewLoading = null;
        _this.viewScore = null;
        _this.viewMessage = null;
        _this.player = null;
        _this.audioBgm = null;
        _this.audioWin = null;
        _this.audioLose = null;
        _this.audioClick = null;
        _this.videoCamera = new VideoCamera_1.default();
        _this.timerMain = new Timer_1.default();
        _this.timerDelay = new Timer_1.default();
        _this.timerCountdown = new Timer_1.default();
        _this.audioBgmId = 0;
        _this.detectPoint = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        _this.speed = Defines_1.default.GAME_SPEED_MIN;
        _this.speedTarget = Defines_1.default.GAME_SPEED_MIN;
        _this.score = 0;
        _this.countdown = 3;
        return _this;
      }
      GameMgr.prototype.onLoad = function() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        window.innerWidth < window.innerHeight ? cc.Canvas.instance.designResolution = new cc.Size(750, 1334) : cc.Canvas.instance.designResolution = new cc.Size(1334, 750);
        this.timerDelay.SetDuration(3);
        this.timerCountdown.SetDuration(1);
      };
      GameMgr.prototype.start = function() {
        EventMgr_1.EventMgr.instance.on(Defines_1.GameEvent.TOUCH, this.TouchHandler, this);
        EventMgr_1.EventMgr.instance.on(Defines_1.GameEvent.COLLECT_ITEM, this.OnScore, this);
        EventMgr_1.EventMgr.instance.on(Defines_1.GameEvent.PLAYER_HURT, this.OnHurt, this);
        this.pusher = new window.Pusher("9ffb9507bc94e5760d4f", {
          cluster: "ap1"
        });
        var channel = window.userParams.ch;
        this.channel = channel ? this.pusher.subscribe("utop-" + channel) : this.pusher.subscribe("utop");
        try {
          var settings = JSON.parse(cc.sys.localStorage.getItem("settings"));
          if (null != settings) {
            if (Settings_1.default.useSound != settings.useSound) {
              console.log(JSON.stringify(settings));
              this.viewMainMenu.SwitchSound();
            }
            Settings_1.default.useSound && this.PlayBgm();
          }
        } catch (e) {}
        this.SetupCameraML5();
        this.SetState(STATE.INIT);
      };
      GameMgr.prototype.update = function(dt) {
        switch (this.state) {
         case STATE.INIT:
          break;

         case STATE.TOUCH_TO_PLAY:
          this.UpdateSpeed(dt);
          break;

         case STATE.COUNTDOWN:
          this.timerCountdown.Update(dt);
          if (this.timerCountdown.JustFinished()) {
            this.countdown--;
            if (this.countdown > 0) {
              this.viewIngame.SetCountdown(this.countdown);
              this.timerCountdown.Reset();
            } else if (0 == this.countdown) {
              this.viewIngame.SetCountdown("GO");
              this.timerCountdown.Reset();
            } else {
              this.viewIngame.SetCountdown("");
              this.SetState(STATE.PLAYING);
            }
          }
          break;

         case STATE.PLAYING:
          this.UpdateSpeed(dt);
          this.timerMain.Update(dt);
          this.timerMain.JustFinished() && this.SetState(STATE.WIN_DELAY);
          this.viewIngame.SetTime(Math.floor(this.timerMain.GetTime()));
          break;

         case STATE.WIN_DELAY:
          this.UpdateSpeed(dt);
          this.timerDelay.Update(dt);
          this.timerDelay.JustFinished() && this.SetState(STATE.WIN);
          break;

         case STATE.WIN:
          this.UpdateSpeed(dt);
          break;

         case STATE.LOSE_DELAY:
          this.timerDelay.Update(dt);
          this.timerDelay.JustFinished() && this.SetState(STATE.LOSE);
        }
        null != this.videoDom && this.videoCamera.Render(this.videoDom);
      };
      GameMgr.prototype.SetState = function(state) {
        var _this = this;
        this.state = state;
        switch (state) {
         case STATE.INIT:
          cc.Camera.main.node.setPosition(0, cc.Camera.main.node.position.y);
          Settings_1.default.useSound && this.PlayBgm();
          this.speed = Defines_1.default.GAME_SPEED_MIN;
          this.speedTarget = Defines_1.default.GAME_SPEED_MIN;
          this.score = 0;
          this.timerMain.SetDuration(Defines_1.default.GAME_TIMEOUT);
          this.obstacleMgr.Init();
          this.collectibleMgr.Init();
          this.player.Init();
          this.PusherInit();
          this.viewMainMenu.Show(function() {
            _this.SetState(STATE.TOUCH_TO_PLAY);
          });
          this.viewIngame.Hide();
          this.viewIngame.ResetScore();
          this.viewIngame.SetTime(Math.floor(this.timerMain.GetTime()));
          break;

         case STATE.TOUCH_TO_PLAY:
          this.player.TouchToPlay();
          this.collectibleMgr.Play();
          break;

         case STATE.COUNTDOWN:
          this.countdown = 3;
          this.player.Play();
          this.player.DisableMagnet();
          this.collectibleMgr.Reset();
          this.viewMainMenu.Hide();
          this.viewIngame.Show();
          this.viewIngame.SetCountdown(this.countdown);
          this.timerCountdown.Reset();
          break;

         case STATE.PLAYING:
          this.obstacleMgr.Play();
          break;

         case STATE.WIN_DELAY:
          this.timerDelay.Reset();
          this.obstacleMgr.Dead();
          this.collectibleMgr.Dead();
          this.player.Win();
          break;

         case STATE.WIN:
          this.StopBgm();
          this.audioWin.play();
          this.GameFinish();
          break;

         case STATE.LOSE_DELAY:
          this.StopBgm();
          this.audioLose.play();
          this.timerDelay.Reset();
          this.obstacleMgr.Dead();
          this.collectibleMgr.Dead();
          this.player.Lose();
          break;

         case STATE.LOSE:
          this.GameFinish();
          break;

         case STATE.PAUSE:
          this.StopBgm();
          this.player.Pause();
          break;

         case STATE.RESUME:
          this.PlayBgm();
          this.player.Resume();
          this.state = STATE.PLAYING;
        }
      };
      GameMgr.prototype.UpdateSpeed = function(dt) {
        var cameraPosition = cc.Camera.main.node.position;
        cc.Camera.main.node.setPosition(cameraPosition.x + this.speed * Defines_1.default.GAME_BASE_SPEED * dt, cameraPosition.y);
        this.speed = cc.misc.lerp(this.speed, this.speedTarget, .1);
      };
      GameMgr.prototype.Replay = function() {};
      GameMgr.prototype.ScoreRetry = function() {
        Settings_1.default.useSound && this.audioClick.play();
        this.Replay();
      };
      GameMgr.prototype.ScoreHome = function() {
        window.parent.location.href = window.userParams.homeUrl;
      };
      GameMgr.prototype.ScoreStore = function() {
        window.location.href = window.userParams.storeUrl;
      };
      GameMgr.prototype.ErrorClose = function() {};
      GameMgr.prototype.SwitchSound = function() {
        this.viewMainMenu.SwitchSound();
        Settings_1.default.useSound ? this.PlayBgm() : this.StopBgm();
        cc.sys.localStorage.setItem("settings", JSON.stringify(Settings_1.default));
      };
      GameMgr.prototype.OnScore = function(collectible) {
        var coinMultiply = collectible.node.scale == Defines_1.default.COLLECTIBLE_SCALE ? 10 : 1;
        if (collectible.type == Defines_1.CollectibleType.MENU) {
          10 == coinMultiply && this.player.EnableMagnet();
          this.state == STATE.PLAYING && (this.score += coinMultiply);
        } else this.state == STATE.PLAYING && (this.score += coinMultiply);
        this.viewIngame.SetScore(this.score);
      };
      GameMgr.prototype.OnHurt = function(hitter) {
        this.SetState(STATE.LOSE_DELAY);
      };
      GameMgr.prototype.GameResume = function() {
        cc.game.resume();
      };
      GameMgr.prototype.GamePause = function() {
        this.state == STATE.PLAYING && this.SetState(STATE.PAUSE);
        cc.game.pause();
      };
      GameMgr.prototype.GameFinish = function() {
        var _this = this;
        var userParams = window.userParams;
        API_1.default.EndGame(userParams.IDTrans, userParams.sessionID, this.score).then(function(response) {
          try {
            var data = JSON.parse(response);
            if (0 == data.code) {
              if (0 == data.typeKQ) _this.GameLose("B\u1ea1n kh\xf4ng \u0111\u1ee7 \u0111i\u1ec3m \u0111\u1ec3 tr\xfang th\u01b0\u1edfng"); else if (1 == data.typeKQ) _this.GameLose("S\u1ed1 l\u01b0\u1ee3ng qu\xe0 \u0111\xe3 v\u01b0\u1ee3t qu\xe1 gi\u1edbi h\u1ea1n"); else if (3 == data.typeKQ) if (0 == data.gameRewardType) _this.GameLose("S\u1ed1 l\u01b0\u1ee3ng qu\xe0 \u0111\xe3 v\u01b0\u1ee3t qu\xe1 gi\u1edbi h\u1ea1n"); else {
                _this.obstacleMgr.evil.FlyOut();
                _this.GameWin(data.rewardName);
              }
            } else {
              _this.viewLoading.node.active = false;
              _this.ShowMessage(data.loi, function() {
                _this.SetState(STATE.INIT);
              });
            }
          } catch (e) {
            _this.viewLoading.node.active = false;
            _this.ShowMessage("D\u1eef li\u1ec7u kh\xf4ng \u0111\xfang c\u1ea5u tr\xfac.", function() {
              _this.SetState(STATE.INIT);
            });
          }
        }).catch(function(error) {
          _this.ShowMessage("Kh\xf4ng th\u1ec3 k\u1ebft n\u1ed1i v\u1edbi m\xe1y ch\u1ee7. Vui l\xf2ng ki\u1ec3m tra k\u1ebft n\u1ed1i m\u1ea1ng v\xe0 th\u1eed l\u1ea1i.", function() {
            _this.SetState(STATE.INIT);
          });
        });
      };
      GameMgr.prototype.ShowMessage = function(message, callback) {
        void 0 === callback && (callback = null);
        this.viewMessage.SetDescription(message, callback);
        this.viewMessage.node.active = true;
      };
      GameMgr.prototype.GameWin = function(message) {
        var _this = this;
        this.viewScore.SetWin(this.score, message, function() {
          _this.SetState(STATE.INIT);
        });
        this.viewScore.node.active = true;
        this.viewIngame.node.active = false;
      };
      GameMgr.prototype.GameLose = function(message) {
        var _this = this;
        this.viewScore.SetLose(message, function() {
          _this.SetState(STATE.INIT);
        });
        this.viewScore.node.active = true;
        this.viewIngame.node.active = false;
      };
      GameMgr.prototype.PlayBgm = function() {
        this.audioBgmId = cc.audioEngine.play(this.audioBgm.clip, true, 1);
      };
      GameMgr.prototype.StopBgm = function() {
        cc.audioEngine.stop(this.audioBgmId);
      };
      GameMgr.prototype.PusherInit = function() {
        var _this = this;
        this.channel.bind("start-game", function(data) {
          var userParams = window.userParams;
          userParams.sessionID = data.message.sessionID;
          _this.viewLoading.node.active = true;
          API_1.default.StartGame(userParams.gc, userParams.ch, userParams.sessionID).then(function(response) {
            try {
              var data_1 = JSON.parse(response);
              if (0 == data_1.code) {
                userParams.IDTrans = data_1.idTrans;
                _this.viewLoading.node.active = false;
                _this.channel.unbind("start-game");
                _this.SetState(STATE.COUNTDOWN);
              } else {
                _this.viewLoading.node.active = false;
                _this.ShowMessage(data_1.result);
              }
            } catch (e) {
              _this.viewLoading.node.active = false;
              _this.ShowMessage("D\u1eef li\u1ec7u kh\xf4ng \u0111\xfang c\u1ea5u tr\xfac.");
            }
          }).catch(function(error) {
            _this.viewLoading.node.active = false;
            _this.ShowMessage(error);
          });
        });
      };
      GameMgr.prototype.TouchHandler = function(event) {
        switch (this.state) {
         case STATE.INIT:
          break;

         case STATE.TOUCH_TO_PLAY:
          Input_1.default.instance.IsTouchDown(event) && this.SetState(STATE.COUNTDOWN);
          break;

         case STATE.PLAYING:
          break;

         case STATE.PAUSE:
          this.SetState(STATE.RESUME);
        }
      };
      GameMgr.prototype.SetupCameraML5 = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _a, poseNet, _b, simpleFaceDetect_1, faceDetect_1;
          var _this = this;
          return __generator(this, function(_c) {
            switch (_c.label) {
             case 0:
              _a = this;
              return [ 4, this.videoCamera.Init(Defines_1.default.USE_SIMPLE_FACE_DETECT) ];

             case 1:
              _a.videoDom = _c.sent();
              if (!!Defines_1.default.USE_SIMPLE_FACE_DETECT) return [ 3, 3 ];
              poseNet = new ML5Wrapper_1.default();
              _b = this;
              return [ 4, poseNet.Init(this.videoDom) ];

             case 2:
              _b.ml5PoseNet = _c.sent();
              this.ml5PoseNet.on("pose", this.OnML5PoseNet.bind(this));
              return [ 3, 4 ];

             case 3:
              simpleFaceDetect_1 = SimpleFaceDetect_1.default.Init();
              faceDetect_1 = function() {
                simpleFaceDetect_1(_this.videoDom, _this.OnSimpleFaceDectect.bind(_this));
                requestAnimationFrame(faceDetect_1);
              };
              requestAnimationFrame(faceDetect_1);
              _c.label = 4;

             case 4:
              return [ 2 ];
            }
          });
        });
      };
      GameMgr.prototype.OnML5PoseNet = function(result) {
        var _this = this;
        if (Input_1.default.instance.isHold) return;
        if (result.length > 0) {
          var faces = result.map(function(face) {
            var nose = cc.v2(face.pose.nose.x, face.pose.nose.y);
            var distance = cc.Vec2.distance(nose, _this.detectPoint);
            return {
              nose: nose,
              distance: distance
            };
          }).sort(function(a, b) {
            return a.distance - b.distance;
          });
          var nose = faces[0].nose;
          var offset = (this.videoDom.videoHeight - this.videoCamera.canvas.height) / 2;
          var x = nose.x * cc.winSize.width / this.videoCamera.canvas.width;
          var y = (nose.y - offset) * cc.winSize.height / this.videoCamera.canvas.height;
          this.player.SetTarget(cc.v3(cc.winSize.width - x, cc.winSize.height - y, 0));
          this.detectPoint = nose;
          this.timerFaceDetect.Reset();
        }
      };
      GameMgr.prototype.OnSimpleFaceDectect = function(result) {
        if (Input_1.default.instance.isHold) return;
        this.player.SetTarget(cc.v3(cc.winSize.width - result.x, cc.winSize.height - result.y, 0));
      };
      __decorate([ property({
        type: ObstacleMgr_1.default
      }) ], GameMgr.prototype, "obstacleMgr", void 0);
      __decorate([ property({
        type: CollectibleMgr_1.default
      }) ], GameMgr.prototype, "collectibleMgr", void 0);
      __decorate([ property({
        type: MainMenu_1.default
      }) ], GameMgr.prototype, "viewMainMenu", void 0);
      __decorate([ property({
        type: Ingame_1.default
      }) ], GameMgr.prototype, "viewIngame", void 0);
      __decorate([ property({
        type: Loading_1.default
      }) ], GameMgr.prototype, "viewLoading", void 0);
      __decorate([ property({
        type: Score_1.default
      }) ], GameMgr.prototype, "viewScore", void 0);
      __decorate([ property({
        type: Message_1.default
      }) ], GameMgr.prototype, "viewMessage", void 0);
      __decorate([ property({
        type: Player_1.default
      }) ], GameMgr.prototype, "player", void 0);
      __decorate([ property({
        type: cc.AudioSource
      }) ], GameMgr.prototype, "audioBgm", void 0);
      __decorate([ property({
        type: cc.AudioSource
      }) ], GameMgr.prototype, "audioWin", void 0);
      __decorate([ property({
        type: cc.AudioSource
      }) ], GameMgr.prototype, "audioLose", void 0);
      __decorate([ property({
        type: cc.AudioSource
      }) ], GameMgr.prototype, "audioClick", void 0);
      GameMgr = __decorate([ ccclass ], GameMgr);
      return GameMgr;
    }(cc.Component);
    exports.default = GameMgr;
    cc._RF.pop();
  }, {
    "./API": "API",
    "./CollectibleMgr": "CollectibleMgr",
    "./Defines": "Defines",
    "./Message": "Message",
    "./ObstacleMgr": "ObstacleMgr",
    "./Player": "Player",
    "./Settings": "Settings",
    "./SimpleFaceDetect": "SimpleFaceDetect",
    "./camera/VideoCamera": "VideoCamera",
    "./core/EventMgr": "EventMgr",
    "./core/Input": "Input",
    "./core/Timer": "Timer",
    "./ml5/ML5Wrapper": "ML5Wrapper",
    "./ui/Ingame": "Ingame",
    "./ui/Loading": "Loading",
    "./ui/MainMenu": "MainMenu",
    "./ui/Score": "Score"
  } ],
  Ingame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ce56bZ/jydEaJ9euUC2iteW", "Ingame");
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
    var Defines_1 = require("../Defines");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Ingame = function(_super) {
      __extends(Ingame, _super);
      function Ingame() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.score = null;
        _this.time = null;
        _this.timeFill = null;
        _this.countdown = null;
        _this.countdownLabel = null;
        _this.scoreCurrent = 0;
        _this.scoreTarget = 0;
        return _this;
      }
      Ingame.prototype.update = function(dt) {
        this.scoreCurrent < this.scoreTarget ? this.scoreCurrent++ : this.scoreCurrent > this.scoreTarget && (this.scoreCurrent -= 5);
        this.scoreCurrent < 0 && (this.scoreCurrent = 0);
        this.score.string = "" + this.scoreCurrent;
      };
      Ingame.prototype.SetScore = function(score) {
        this.scoreTarget = score;
      };
      Ingame.prototype.ResetScore = function() {
        this.scoreCurrent = 0;
        this.scoreTarget = 0;
        this.score.string = "" + this.scoreCurrent;
      };
      Ingame.prototype.SetTime = function(time) {
        var percent = time / Defines_1.default.GAME_TIMEOUT;
        this.time.string = "" + time;
        this.timeFill.fillRange = percent;
      };
      Ingame.prototype.SetCountdown = function(number) {
        this.countdownLabel.string = "" + number;
        this.countdown.scale = 0;
        cc.tween(this.countdown).to(.5, {
          scale: 1
        }, {
          easing: "elasticOut"
        }).start();
      };
      Ingame.prototype.Show = function() {
        this.node.active = true;
      };
      Ingame.prototype.Hide = function() {
        this.node.active = false;
      };
      __decorate([ property(cc.Label) ], Ingame.prototype, "score", void 0);
      __decorate([ property(cc.Label) ], Ingame.prototype, "time", void 0);
      __decorate([ property(cc.Sprite) ], Ingame.prototype, "timeFill", void 0);
      __decorate([ property(cc.Node) ], Ingame.prototype, "countdown", void 0);
      __decorate([ property(cc.Label) ], Ingame.prototype, "countdownLabel", void 0);
      Ingame = __decorate([ ccclass ], Ingame);
      return Ingame;
    }(cc.Component);
    exports.default = Ingame;
    cc._RF.pop();
  }, {
    "../Defines": "Defines"
  } ],
  Init: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fb0e64rMu1It448CA4JE5/E", "Init");
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
    var Defines_1 = require("./Defines");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.loadingIcon = null;
        _this.loadingError = null;
        _this.progress = null;
        return _this;
      }
      NewClass.prototype.start = function() {
        this.LoadScene();
      };
      NewClass.prototype.update = function(dt) {
        this.loadingIcon.angle -= 2 * Defines_1.default.GAME_BASE_SPEED * dt;
      };
      NewClass.prototype.LoadScene = function() {
        var _this = this;
        this.loadingIcon.active = true;
        this.progress.node.active = true;
        this.loadingError.active = false;
        cc.director.preloadScene("main", function(completedCount, totalCount, item) {
          var progress = completedCount / totalCount;
          _this.progress.string = Math.floor(100 * progress) + "%";
        }, function(error) {
          if (error) {
            _this.loadingIcon.active = false;
            _this.progress.node.active = false;
            _this.loadingError.active = true;
            return;
          }
          cc.director.loadScene("main");
        });
      };
      __decorate([ property({
        type: cc.Node
      }) ], NewClass.prototype, "loadingIcon", void 0);
      __decorate([ property({
        type: cc.Node
      }) ], NewClass.prototype, "loadingError", void 0);
      __decorate([ property({
        type: cc.Label
      }) ], NewClass.prototype, "progress", void 0);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {
    "./Defines": "Defines"
  } ],
  Input: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "86a1eETgqhC7LCRoYW35gpp", "Input");
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
    var EventMgr_1 = require("./EventMgr");
    var Defines_1 = require("../Defines");
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
      Input.prototype.update = function(deltaTime) {
        if (this.isHold) {
          cc.Vec2.subtract(this.delta, this.position, this.prevPosition);
          this.prevPosition = this.position;
        }
      };
      Input.prototype.onTouchStart = function(event) {
        this.position = event.touch.getLocation();
        this.prevPosition = event.touch.getLocation();
        this.isHold = true;
        EventMgr_1.EventMgr.instance.emit(Defines_1.GameEvent.TOUCH, event);
      };
      Input.prototype.onTouchEnd = function(event) {
        this.delta = new cc.Vec2(0, 0);
        this.isHold = false;
        EventMgr_1.EventMgr.instance.emit(Defines_1.GameEvent.TOUCH, event);
      };
      Input.prototype.onTouchMove = function(event) {
        this.position = event.touch.getLocation();
        EventMgr_1.EventMgr.instance.emit(Defines_1.GameEvent.TOUCH, event);
      };
      Input.prototype.IsTouchDown = function(event) {
        return event.type == cc.Node.EventType.TOUCH_START;
      };
      var Input_1;
      Input.instance = null;
      Input = Input_1 = __decorate([ ccclass ], Input);
      return Input;
    }(cc.Component);
    exports.default = Input;
    cc._RF.pop();
  }, {
    "../Defines": "Defines",
    "./EventMgr": "EventMgr"
  } ],
  Loading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2d4afTuZMtEMrP5rpbFpmae", "Loading");
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
    var Defines_1 = require("../Defines");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Loading = function(_super) {
      __extends(Loading, _super);
      function Loading() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.icon = null;
        return _this;
      }
      Loading.prototype.update = function(dt) {
        this.icon.angle -= 2 * Defines_1.default.GAME_BASE_SPEED * dt;
      };
      __decorate([ property(cc.Node) ], Loading.prototype, "icon", void 0);
      Loading = __decorate([ ccclass ], Loading);
      return Loading;
    }(cc.Component);
    exports.default = Loading;
    cc._RF.pop();
  }, {
    "../Defines": "Defines"
  } ],
  ML5Wrapper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "20114E7oaRPHrR5hNQHODla", "ML5Wrapper");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ML5PoseNet = function() {
      function ML5PoseNet() {}
      ML5PoseNet.prototype.Init = function(video) {
        return __awaiter(this, void 0, void 0, function() {
          var options, poseNet;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              options = {
                architecture: "MobileNetV1",
                imageScaleFactor: .1,
                outputStride: 16,
                minConfidence: .05,
                maxPoseDetections: 5,
                scoreThreshold: .5,
                nmsRadius: 20,
                detectionType: "multiple",
                inputResolution: 161,
                multiplier: .75,
                quantBytes: 2
              };
              return [ 4, window.ml5.poseNet(video, options) ];

             case 1:
              poseNet = _a.sent();
              return [ 2, poseNet ];
            }
          });
        });
      };
      return ML5PoseNet;
    }();
    exports.default = ML5PoseNet;
    cc._RF.pop();
  }, {} ],
  MainMenu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "351efv7WZBKH6uOJ8Wks8g4", "MainMenu");
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
    var Settings_1 = require("../Settings");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MainMenu = function(_super) {
      __extends(MainMenu, _super);
      function MainMenu() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.slogun = null;
        return _this;
      }
      MainMenu.prototype.start = function() {};
      MainMenu.prototype.update = function(dt) {};
      MainMenu.prototype.Show = function(callback) {
        this.slogun.active = true;
        callback();
      };
      MainMenu.prototype.Hide = function() {
        this.slogun.active = false;
      };
      MainMenu.prototype.SwitchSound = function() {
        Settings_1.default.useSound = !Settings_1.default.useSound;
      };
      __decorate([ property(cc.Node) ], MainMenu.prototype, "slogun", void 0);
      MainMenu = __decorate([ ccclass ], MainMenu);
      return MainMenu;
    }(cc.Component);
    exports.default = MainMenu;
    cc._RF.pop();
  }, {
    "../Settings": "Settings"
  } ],
  Message: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "128b61G1odLzKumkTFkT8WU", "Message");
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
    var Defines_1 = require("./Defines");
    var Timer_1 = require("./core/Timer");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Message = function(_super) {
      __extends(Message, _super);
      function Message() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.description = null;
        _this.timerHide = null;
        return _this;
      }
      Message.prototype.onEnable = function() {
        this.node.setScale(.01);
        cc.tween(this.node).to(.5, {
          scale: 1
        }, {
          easing: "elasticOut"
        }).start();
      };
      Message.prototype.start = function() {};
      Message.prototype.update = function(dt) {
        if (null != this.timerHide) {
          this.timerHide.Update(dt);
          this.timerHide.JustFinished() && this.OnClose();
        }
      };
      Message.prototype.SetDescription = function(description, callback) {
        void 0 === callback && (callback = null);
        this.description.string = description;
        this.callback = callback;
        this.timerHide = new Timer_1.default();
        this.timerHide.SetDuration(Defines_1.default.GAME_RESULT_TIMEOUT);
      };
      Message.prototype.OnClose = function() {
        var _this = this;
        cc.tween(this.node).to(.5, {
          scale: 0
        }, {
          easing: "elasticIn"
        }).call(function() {
          _this.node.active = false;
          null != _this.callback && _this.callback();
        }).start();
      };
      __decorate([ property({
        type: cc.Label
      }) ], Message.prototype, "description", void 0);
      Message = __decorate([ ccclass ], Message);
      return Message;
    }(cc.Component);
    exports.default = Message;
    cc._RF.pop();
  }, {
    "./Defines": "Defines",
    "./core/Timer": "Timer"
  } ],
  ObstacleMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "76c39EBKUlEkqbPqSITHDnu", "ObstacleMgr");
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
    var Defines_1 = require("./Defines");
    var Rocket_1 = require("./Rocket");
    var Evil_1 = require("./Evil");
    var Timer_1 = require("./core/Timer");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var STATE;
    (function(STATE) {
      STATE[STATE["INIT"] = 0] = "INIT";
      STATE[STATE["PLAYING"] = 1] = "PLAYING";
      STATE[STATE["DEAD"] = 2] = "DEAD";
    })(STATE || (STATE = {}));
    var ObstacleMgr = function(_super) {
      __extends(ObstacleMgr, _super);
      function ObstacleMgr() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.rocketPrefab = null;
        _this.evil = null;
        _this.player = null;
        _this.rockets = [];
        _this.timerSpawnEvil = new Timer_1.default();
        _this.timerSpawnRocket = new Timer_1.default();
        return _this;
      }
      ObstacleMgr.prototype.start = function() {};
      ObstacleMgr.prototype.update = function(dt) {
        if (cc.game.isPaused()) return;
        switch (this.state) {
         case STATE.INIT:
          break;

         case STATE.PLAYING:
          this.timerSpawnEvil.Update(dt);
          this.timerSpawnEvil.JustFinished() && this.SpawnEvil();
          this.timerSpawnRocket.Update(dt);
          if (this.timerSpawnRocket.JustFinished()) {
            this.SpawnRocket(this.player.position.y, this.rocketSpeed);
            this.timerSpawnRocket.SetDuration(Defines_1.RandomInt(4, 6));
          }
          break;

         case STATE.DEAD:
        }
      };
      ObstacleMgr.prototype.SetState = function(state) {
        this.state = state;
        switch (state) {
         case STATE.INIT:
          this.rocketSpeed = 10;
          this.timerSpawnEvil.SetDuration(Defines_1.default.GAME_TIMEOUT / 2);
          this.timerSpawnRocket.SetDuration(Defines_1.default.GAME_TIMEOUT / 6);
          this.rockets = [];
          for (var i = 0; i < Defines_1.default.ROCKET_MAX; i++) {
            var rocket = cc.instantiate(this.rocketPrefab);
            rocket.parent = this.node;
            rocket.active = false;
            this.rockets.push(rocket);
          }
          break;

         case STATE.PLAYING:
          break;

         case STATE.DEAD:
          this.evil.Dead();
        }
      };
      ObstacleMgr.prototype.Init = function() {
        this.SetState(STATE.INIT);
      };
      ObstacleMgr.prototype.Play = function() {
        this.SetState(STATE.PLAYING);
      };
      ObstacleMgr.prototype.SpawnRocket = function(y, speed) {
        var rocket = this.GetInactiveRocket();
        if (null != rocket) {
          rocket.getComponent(Rocket_1.default).Spawn(y, Math.max(speed, 15));
          this.rocketSpeed += .5;
        }
      };
      ObstacleMgr.prototype.SpawnEvil = function() {
        var dir = (Defines_1.RandomInt(0, 100) < 50, 1);
        var cameraPosition = cc.Camera.main.node.position;
        var left = cameraPosition.x - 100;
        var right = cameraPosition.x + cc.winSize.width + 100;
        var evil = this.evil.getComponent(Evil_1.default);
        dir > 0 ? evil.Fly(this.player, dir, cc.v3(right, this.player.position.y, 0)) : evil.Fly(this.player, dir, cc.v3(left, this.player.position.y, 0));
      };
      ObstacleMgr.prototype.Dead = function() {
        this.SetState(STATE.DEAD);
      };
      ObstacleMgr.prototype.GetInactiveRocket = function() {
        for (var i = 0; i < Defines_1.default.ROCKET_MAX; i++) {
          var rocket = this.rockets[i].getComponent(Rocket_1.default);
          if (rocket.IsHidden()) return this.rockets[i];
        }
        return null;
      };
      __decorate([ property({
        type: cc.Prefab
      }) ], ObstacleMgr.prototype, "rocketPrefab", void 0);
      __decorate([ property({
        type: Evil_1.default
      }) ], ObstacleMgr.prototype, "evil", void 0);
      __decorate([ property({
        type: cc.Node
      }) ], ObstacleMgr.prototype, "player", void 0);
      ObstacleMgr = __decorate([ ccclass ], ObstacleMgr);
      return ObstacleMgr;
    }(cc.Component);
    exports.default = ObstacleMgr;
    cc._RF.pop();
  }, {
    "./Defines": "Defines",
    "./Evil": "Evil",
    "./Rocket": "Rocket",
    "./core/Timer": "Timer"
  } ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d652cNzqgJBcZvh21QthUXO", "Player");
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
    var Defines_1 = require("./Defines");
    var EventMgr_1 = require("./core/EventMgr");
    var Collectible_1 = require("./Collectible");
    var Timer_1 = require("./core/Timer");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var STATE;
    (function(STATE) {
      STATE[STATE["INIT"] = 0] = "INIT";
      STATE[STATE["TOUCH_TO_PLAY"] = 1] = "TOUCH_TO_PLAY";
      STATE[STATE["PLAYING"] = 2] = "PLAYING";
      STATE[STATE["PAUSE"] = 3] = "PAUSE";
      STATE[STATE["RESUME"] = 4] = "RESUME";
      STATE[STATE["WIN"] = 5] = "WIN";
      STATE[STATE["LOSE"] = 6] = "LOSE";
    })(STATE || (STATE = {}));
    var ANIM;
    (function(ANIM) {
      ANIM["FLY"] = "FLYING_NORMAL";
      ANIM["HIT"] = "FLYING_HIT";
    })(ANIM || (ANIM = {}));
    var Player = function(_super) {
      __extends(Player, _super);
      function Player() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.spine = null;
        _this.particleHit = null;
        _this.audioHurt = null;
        _this.magnet = null;
        _this.timerGotHit = new Timer_1.default();
        _this.timerMagnet = new Timer_1.default();
        _this.target = null;
        return _this;
      }
      Player.prototype.start = function() {
        this.spine.setCompleteListener(this.OnAnimationComplete.bind(this));
      };
      Player.prototype.update = function(dt) {
        switch (this.state) {
         case STATE.INIT:
          null != this.target && this.node.setPosition(this.node.position.lerp(this.target, .1 * Defines_1.default.GAME_BASE_SPEED * dt));
          break;

         case STATE.TOUCH_TO_PLAY:
          if (null != this.target) {
            var target = this.target.add(cc.Camera.main.node.position);
            this.node.setPosition(this.node.position.lerp(target, .1 * Defines_1.default.GAME_BASE_SPEED * dt));
          }
          break;

         case STATE.PLAYING:
          if (this.startX > cc.winSize.width / 3) {
            this.startX -= Defines_1.default.GAME_BASE_SPEED * dt;
            this.startX < cc.winSize.width / 3 && (this.startX = cc.winSize.width / 3);
          }
          null != this.target && this.node.setPosition(this.node.position.lerp(this.target, .1));
          this.node.setPosition(cc.Camera.main.node.position.x + this.startX, this.node.position.y);
          this.timerMagnet.Update(dt);
          this.timerMagnet.JustFinished() && (this.magnet.enabled = false);
          break;

         case STATE.WIN:
          this.startX = cc.misc.lerp(this.startX, 2 * cc.winSize.width, dt / 5);
          this.node.setPosition(this.node.position.lerp(cc.v3(cc.winSize.width / 2, cc.winSize.height / 2, 0), dt));
          this.node.setPosition(cc.Camera.main.node.position.x + this.startX, this.node.position.y);
          break;

         case STATE.LOSE:
          this.node.angle = cc.misc.lerp(this.node.angle, -45, 2 * dt);
          this.node.setPosition(this.node.position.lerp(this.target, dt));
        }
        this.timerGotHit.Update(dt);
        this.timerGotHit.JustFinished() && (this.node.opacity = 255);
      };
      Player.prototype.SetState = function(state) {
        this.state = state;
        switch (state) {
         case STATE.INIT:
          this.startX = cc.winSize.width / 2;
          this.node.setPosition(this.startX, cc.winSize.height / 2);
          this.target = this.node.position;
          this.node.angle = 0;
          this.magnet.enabled = false;
          break;

         case STATE.PLAYING:
         case STATE.PAUSE:
          break;

         case STATE.RESUME:
          this.state = STATE.PLAYING;
          break;

         case STATE.WIN:
          break;

         case STATE.LOSE:
          this.target = cc.v3(this.node.position.x, this.node.position.y - cc.winSize.height, 0);
        }
      };
      Player.prototype.SetTarget = function(target) {
        this.state != STATE.LOSE && (this.target = target);
      };
      Player.prototype.EnableMagnet = function() {
        this.magnet.enabled = true;
        this.timerMagnet.SetDuration(10);
      };
      Player.prototype.DisableMagnet = function() {
        this.magnet.enabled = false;
      };
      Player.prototype.Init = function() {
        this.SetState(STATE.INIT);
      };
      Player.prototype.TouchToPlay = function() {
        this.SetState(STATE.TOUCH_TO_PLAY);
      };
      Player.prototype.Play = function() {
        this.SetState(STATE.PLAYING);
      };
      Player.prototype.Pause = function() {
        this.SetState(STATE.PAUSE);
      };
      Player.prototype.Resume = function() {
        this.SetState(STATE.RESUME);
      };
      Player.prototype.Win = function() {
        this.SetState(STATE.WIN);
      };
      Player.prototype.Lose = function() {
        this.SetState(STATE.LOSE);
      };
      Player.prototype.GotHit = function(hitter) {
        if (!this.timerGotHit.IsDone()) return;
        for (var i = 0; i < this.particleHit.childrenCount; i++) {
          var particle = this.particleHit.children[i].getComponent(cc.ParticleSystem);
          Defines_1.RandomInt(0, 100) < 50 && particle.resetSystem();
        }
        this.spine.setAnimation(0, ANIM.HIT, false);
        this.node.opacity = 128;
        this.timerGotHit.SetDuration(2);
        this.audioHurt.play();
        EventMgr_1.EventMgr.instance.emit(Defines_1.GameEvent.PLAYER_HURT, hitter);
      };
      Player.prototype.OnAnimationComplete = function(entry) {
        switch (entry.animation.name) {
         case ANIM.HIT:
          this.spine.setAnimation(0, ANIM.FLY, true);
        }
      };
      Player.prototype.onCollisionEnter = function(other, self) {
        if (this.state != STATE.PLAYING && this.state != STATE.TOUCH_TO_PLAY) return;
        switch (other.tag) {
         case Defines_1.CollisionTag.COLLECTIBLE:
          var collectible = other.node.getComponent(Collectible_1.default);
          if (self == this.magnet) collectible.Follow(this); else {
            collectible.Collect();
            EventMgr_1.EventMgr.instance.emit(Defines_1.GameEvent.COLLECT_ITEM, collectible);
          }
          break;

         case Defines_1.CollisionTag.ROCKET:
         case Defines_1.CollisionTag.EVIL:
          self != this.magnet && this.GotHit(other.tag);
        }
      };
      __decorate([ property({
        type: sp.Skeleton
      }) ], Player.prototype, "spine", void 0);
      __decorate([ property({
        type: cc.Node
      }) ], Player.prototype, "particleHit", void 0);
      __decorate([ property({
        type: cc.AudioSource
      }) ], Player.prototype, "audioHurt", void 0);
      __decorate([ property({
        type: cc.CircleCollider
      }) ], Player.prototype, "magnet", void 0);
      Player = __decorate([ ccclass ], Player);
      return Player;
    }(cc.Component);
    exports.default = Player;
    cc._RF.pop();
  }, {
    "./Collectible": "Collectible",
    "./Defines": "Defines",
    "./core/EventMgr": "EventMgr",
    "./core/Timer": "Timer"
  } ],
  PopupError: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d4675oSmoFCYbZsUn1UOBSA", "PopupError");
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
    var PopupCoin = function(_super) {
      __extends(PopupCoin, _super);
      function PopupCoin() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sprites = [];
        _this.buttonSprite = null;
        _this.message = null;
        return _this;
      }
      PopupCoin.prototype.onEnable = function() {
        this.node.setScale(.01);
        cc.tween(this.node).to(.5, {
          scale: 1
        }, {
          easing: "elasticOut"
        }).start();
      };
      PopupCoin.prototype.SetMessage = function(message) {
        this.message.string = message;
      };
      PopupCoin.prototype.Show = function(type) {
        this.buttonSprite.spriteFrame = this.sprites[type - 1];
        this.node.active = true;
      };
      PopupCoin.prototype.Hide = function(callback) {
        cc.tween(this.node).to(.5, {
          scale: 0
        }, {
          easing: "elasticIn"
        }).call(callback).start();
      };
      __decorate([ property({
        type: [ cc.SpriteFrame ]
      }) ], PopupCoin.prototype, "sprites", void 0);
      __decorate([ property({
        type: cc.Sprite
      }) ], PopupCoin.prototype, "buttonSprite", void 0);
      __decorate([ property({
        type: cc.Label
      }) ], PopupCoin.prototype, "message", void 0);
      PopupCoin = __decorate([ ccclass ], PopupCoin);
      return PopupCoin;
    }(cc.Component);
    exports.default = PopupCoin;
    cc._RF.pop();
  }, {} ],
  QRCode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c0b5cczF6tK2IbZ6VMLWjjz", "QRCode");
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
    var Defines_1 = require("../Defines");
    var Timer_1 = require("./Timer");
    var API_1 = require("../API");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var QRCode = function(_super) {
      __extends(QRCode, _super);
      function QRCode() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.timer = new Timer_1.default();
        return _this;
      }
      QRCode.prototype.onLoad = function() {
        this.ctx = this.node.addComponent(cc.Graphics);
        this.UpdateParams();
      };
      QRCode.prototype.update = function(dt) {
        this.timer.Update(dt);
        this.timer.JustFinished() && this.RefreshQR(Defines_1.default.QR_REFRESH_RATE);
      };
      QRCode.prototype.ParseUrl = function(url) {
        var regex = /[?&]([^=#]+)=([^&#]*)/g;
        var params = {};
        var match;
        while (match = regex.exec(url)) params[match[1]] = decodeURIComponent(match[2]);
        return params;
      };
      QRCode.prototype.UpdateParams = function() {
        var userParams = window.userParams;
        var customParams = this.ParseUrl(window.location.href);
        Object.keys(customParams).forEach(function(key) {
          userParams[key] = customParams[key];
        });
        userParams.landing += "?gc=" + (userParams.gc || 1) + "&ch=" + (userParams.ch || 1) + "&location=" + (userParams.location || "vanhanhmall") + "&t={t}";
      };
      QRCode.prototype.CreateQR = function(url) {
        var qr = new qrcode(-1, "L");
        qr.addData(url);
        qr.make();
        this.ctx.fillColor = cc.Color.WHITE;
        this.ctx.rect(-this.node.width / 2, -this.node.height / 2, this.node.width, this.node.height);
        this.ctx.fill();
        var tileW = this.node.width / qr.getModuleCount();
        var tileH = this.node.height / qr.getModuleCount();
        for (var row = 0; row < qr.getModuleCount(); row++) for (var col = 0; col < qr.getModuleCount(); col++) if (qr.isDark(row, col)) {
          var w = Math.ceil((col + 1) * tileW) - Math.floor(col * tileW);
          var h = Math.ceil((row + 1) * tileW) - Math.floor(row * tileW);
          this.ctx.fillColor = cc.Color.BLACK;
          this.ctx.rect(Math.round(col * tileW) - this.node.width / 2, Math.round(row * tileH) - this.node.height / 2, w, h);
          this.ctx.fill();
        }
      };
      QRCode.prototype.RefreshQR = function(timeout) {
        var _this = this;
        API_1.default.GetTime().then(function(response) {
          var data = JSON.parse(response);
          var userParams = window.userParams;
          var url = userParams.landing.replace("{t}", data.timeStamp);
          _this.CreateQR(url);
          _this.timer.SetDuration(timeout);
        }).catch(function(error) {
          _this.timer.SetDuration(5);
        });
      };
      QRCode = __decorate([ ccclass ], QRCode);
      return QRCode;
    }(cc.Component);
    exports.default = QRCode;
    cc._RF.pop();
  }, {
    "../API": "API",
    "../Defines": "Defines",
    "./Timer": "Timer"
  } ],
  Rocket: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "28b21mB0itJ/JOyGv7GOWG9", "Rocket");
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
    var Defines_1 = require("./Defines");
    var Timer_1 = require("./core/Timer");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var STATE;
    (function(STATE) {
      STATE[STATE["ALARM"] = 0] = "ALARM";
      STATE[STATE["FIRE"] = 1] = "FIRE";
      STATE[STATE["PLAYING"] = 2] = "PLAYING";
      STATE[STATE["HIDE"] = 3] = "HIDE";
    })(STATE || (STATE = {}));
    var Rocket = function(_super) {
      __extends(Rocket, _super);
      function Rocket() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.alarm = null;
        _this.rocket = null;
        _this.audioAlarm = null;
        _this.audioFire = null;
        _this.timerAlarm = new Timer_1.default();
        _this.speed = 0;
        _this.isExploded = false;
        return _this;
      }
      Rocket.prototype.update = function(dt) {
        var cameraPosition = cc.Camera.main.node.position;
        switch (this.state) {
         case STATE.ALARM:
          this.node.setPosition(cc.winSize.width - 100 + cameraPosition.x, this.node.position.y);
          this.timerAlarm.Update(dt);
          this.timerAlarm.IsDone() && this.Fire(cameraPosition.x);
          break;

         case STATE.PLAYING:
          this.node.setPosition(this.node.position.subtract(cc.v3(this.speed * Defines_1.default.GAME_BASE_SPEED * dt, 0, 0)));
          this.node.position.x - cameraPosition.x < -cc.winSize.width && this.SetState(STATE.HIDE);
          break;

         case STATE.HIDE:
        }
      };
      Rocket.prototype.onExploded = function() {
        this.node.active = false;
      };
      Rocket.prototype.SetState = function(state) {
        this.state = state;
        switch (state) {
         case STATE.ALARM:
          this.isExploded = false;
          this.alarm.active = true;
          this.rocket.active = false;
          this.node.active = true;
          this.audioAlarm.play();
          this.timerAlarm.SetDuration(1);
          break;

         case STATE.FIRE:
          this.alarm.active = false;
          this.rocket.active = true;
          this.audioFire.play();
          this.SetState(STATE.PLAYING);
          break;

         case STATE.PLAYING:
          this.node.active = true;
          break;

         case STATE.HIDE:
          this.node.active = false;
        }
      };
      Rocket.prototype.Spawn = function(y, speed) {
        void 0 === speed && (speed = 0);
        this.speed = speed;
        this.node.setPosition(0, y);
        this.SetState(STATE.ALARM);
      };
      Rocket.prototype.Fire = function(x) {
        this.node.setPosition(x + cc.winSize.width + 200, this.node.position.y);
        this.SetState(STATE.FIRE);
      };
      Rocket.prototype.Explode = function() {
        this.isExploded = true;
      };
      Rocket.prototype.Hide = function() {
        this.isExploded || (this.node.active = false);
      };
      Rocket.prototype.IsHidden = function() {
        return !this.node.active;
      };
      __decorate([ property({
        type: cc.Node
      }) ], Rocket.prototype, "alarm", void 0);
      __decorate([ property({
        type: cc.Node
      }) ], Rocket.prototype, "rocket", void 0);
      __decorate([ property({
        type: cc.AudioSource
      }) ], Rocket.prototype, "audioAlarm", void 0);
      __decorate([ property({
        type: cc.AudioSource
      }) ], Rocket.prototype, "audioFire", void 0);
      Rocket = __decorate([ ccclass ], Rocket);
      return Rocket;
    }(cc.Component);
    exports.default = Rocket;
    cc._RF.pop();
  }, {
    "./Defines": "Defines",
    "./core/Timer": "Timer"
  } ],
  Score: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4b8dbx0F+1EK4gLUoDKA4c0", "Score");
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
    var Defines_1 = require("../Defines");
    var Timer_1 = require("../core/Timer");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Score = function(_super) {
      __extends(Score, _super);
      function Score() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.score = null;
        _this.win = null;
        _this.lose = null;
        _this.winMessage = null;
        _this.loseMessage = null;
        _this.timerHide = null;
        return _this;
      }
      Score.prototype.onEnable = function() {
        this.node.opacity = 0;
        cc.tween(this.node).to(.5, {
          opacity: 255
        }, {
          easing: "sineIn"
        }).start();
      };
      Score.prototype.update = function(dt) {
        if (null != this.timerHide) {
          this.timerHide.Update(dt);
          this.timerHide.JustFinished() && this.Hide(this.callback);
        }
      };
      Score.prototype.SetWin = function(score, message, callback) {
        void 0 === callback && (callback = null);
        this.win.active = true;
        this.lose.active = false;
        this.score.string = "" + score;
        this.winMessage.string = null != message ? message : "";
        this.callback = callback;
        this.timerHide = new Timer_1.default();
        this.timerHide.SetDuration(Defines_1.default.GAME_RESULT_TIMEOUT);
      };
      Score.prototype.SetLose = function(message, callback) {
        void 0 === callback && (callback = null);
        this.win.active = false;
        this.lose.active = true;
        this.loseMessage.string = message;
        this.callback = callback;
        this.timerHide = new Timer_1.default();
        this.timerHide.SetDuration(Defines_1.default.GAME_RESULT_TIMEOUT);
      };
      Score.prototype.Hide = function(callback) {
        var _this = this;
        cc.tween(this.node).to(.5, {
          opacity: 0
        }, {
          easing: "sineIn"
        }).call(function() {
          null != callback && callback();
          _this.node.active = false;
        }).start();
      };
      __decorate([ property({
        type: cc.Label
      }) ], Score.prototype, "score", void 0);
      __decorate([ property({
        type: cc.Node
      }) ], Score.prototype, "win", void 0);
      __decorate([ property({
        type: cc.Node
      }) ], Score.prototype, "lose", void 0);
      __decorate([ property({
        type: cc.Label
      }) ], Score.prototype, "winMessage", void 0);
      __decorate([ property({
        type: cc.Label
      }) ], Score.prototype, "loseMessage", void 0);
      Score = __decorate([ ccclass ], Score);
      return Score;
    }(cc.Component);
    exports.default = Score;
    cc._RF.pop();
  }, {
    "../Defines": "Defines",
    "../core/Timer": "Timer"
  } ],
  Scrollable: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "57b7aKPTL1GaKtvIwp9ztlP", "Scrollable");
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
    var Defines_1 = require("./Defines");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var STATE;
    (function(STATE) {
      STATE[STATE["INIT"] = 0] = "INIT";
      STATE[STATE["PLAYING"] = 1] = "PLAYING";
      STATE[STATE["PAUSE"] = 2] = "PAUSE";
      STATE[STATE["DEAD"] = 3] = "DEAD";
    })(STATE || (STATE = {}));
    var Scrollable = function(_super) {
      __extends(Scrollable, _super);
      function Scrollable() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sprites = [];
        _this.speed = 0;
        _this.overlapOffset = 2;
        return _this;
      }
      Scrollable.prototype.onLoad = function() {};
      Scrollable.prototype.start = function() {};
      Scrollable.prototype.update = function(dt) {
        switch (this.state) {
         case STATE.INIT:
          break;

         case STATE.PLAYING:
          var cameraPosition = cc.Camera.main.node.position;
          for (var i = 0; i < this.sprites.length; i++) if (cameraPosition.x - this.sprites[i].position.x - this.node.position.x >= this.sprites[i].width - this.overlapOffset) {
            this.sprites[i].setPosition(this.sprites[this.lastIndex].position.x + this.sprites[this.lastIndex].width - this.overlapOffset, this.sprites[i].position.y);
            this.lastIndex++;
            this.lastIndex == this.sprites.length && (this.lastIndex = 0);
          }
          this.node.setPosition(this.node.position.x + this.speed * Defines_1.default.GAME_BASE_SPEED * dt, this.node.position.y);
          break;

         case STATE.DEAD:
        }
      };
      Scrollable.prototype.SetState = function(state) {
        this.state = state;
        switch (state) {
         case STATE.INIT:
          var x = 0;
          for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].setPosition(x, this.sprites[i].position.y);
            x += this.sprites[i].width - this.overlapOffset;
          }
          this.lastIndex = this.sprites.length - 1;
          this.node.setPosition(0, this.node.position.y);
          break;

         case STATE.PLAYING:
         case STATE.DEAD:
        }
      };
      Scrollable.prototype.SetTheme = function(sprites) {
        for (var i = 0; i < this.sprites.length; i++) this.sprites[i].getComponent(cc.Sprite).spriteFrame = sprites[i];
      };
      Scrollable.prototype.Init = function() {
        this.SetState(STATE.INIT);
      };
      Scrollable.prototype.Play = function() {
        this.SetState(STATE.PLAYING);
      };
      Scrollable.prototype.Dead = function() {
        this.SetState(STATE.DEAD);
      };
      Scrollable.prototype.Pause = function() {
        this.SetState(STATE.PAUSE);
      };
      Scrollable.prototype.Resume = function() {
        this.state = STATE.PLAYING;
      };
      __decorate([ property({
        type: [ cc.Node ]
      }) ], Scrollable.prototype, "sprites", void 0);
      __decorate([ property({
        type: cc.Float
      }) ], Scrollable.prototype, "speed", void 0);
      Scrollable = __decorate([ ccclass ], Scrollable);
      return Scrollable;
    }(cc.Component);
    exports.default = Scrollable;
    cc._RF.pop();
  }, {
    "./Defines": "Defines"
  } ],
  Settings: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "407108dGK9E7Zg4Zj6ToW2S", "Settings");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = new (function() {
      function Settings() {
        this.useSound = true;
      }
      return Settings;
    }())();
    cc._RF.pop();
  }, {} ],
  SimpleFaceDetect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "03f518hEaRAnaBCBt2xkN8Y", "SimpleFaceDetect");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = new (function() {
      function SimpleFaceDetect() {}
      SimpleFaceDetect.prototype.Init = function() {
        var pico = window.pico;
        var update_memory = pico.instantiate_detection_memory(5);
        var facefinder_classify_region = function(r, c, s, pixels, ldim) {
          return -1;
        };
        var cascadeurl = "libs/picojs/models/facefinder";
        fetch(cascadeurl).then(function(response) {
          response.arrayBuffer().then(function(buffer) {
            var bytes = new Int8Array(buffer);
            facefinder_classify_region = pico.unpack_cascade(bytes);
            console.log("* facefinder loaded");
          });
        });
        var canvas = document.getElementById("VideoCanvas");
        var ctx = canvas.getContext("2d");
        function rgba_to_grayscale(rgba, nrows, ncols) {
          var gray = new Uint8Array(nrows * ncols);
          for (var r = 0; r < nrows; ++r) for (var c = 0; c < ncols; ++c) gray[r * ncols + c] = (2 * rgba[4 * r * ncols + 4 * c + 0] + 7 * rgba[4 * r * ncols + 4 * c + 1] + 1 * rgba[4 * r * ncols + 4 * c + 2]) / 10;
          return gray;
        }
        var processfn = function(video, callback) {
          var rect = {
            x: 0,
            y: 0,
            width: video.videoWidth,
            height: video.videoHeight
          };
          if (rect.width > 0 && rect.height > 0) {
            var rgba = ctx.getImageData(rect.x, rect.y, rect.width, rect.height).data;
            var image = {
              pixels: rgba_to_grayscale(rgba, rect.width, rect.height),
              nrows: rect.height,
              ncols: rect.width,
              ldim: rect.width
            };
            var params = {
              shiftfactor: .1,
              minsize: 50,
              maxsize: 1e3,
              scalefactor: 1.1
            };
            var dets = pico.run_cascade(image, facefinder_classify_region, params);
            dets = update_memory(dets);
            dets = pico.cluster_detections(dets, .2);
            for (var i = 0; i < dets.length; ++i) dets[i][3] > 50 && callback({
              x: dets[i][1] * cc.winSize.width / canvas.width,
              y: dets[i][0] * cc.winSize.height / canvas.height
            });
          }
        };
        return processfn;
      };
      return SimpleFaceDetect;
    }())();
    cc._RF.pop();
  }, {} ],
  Timer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b85cbHB39ATpO/QtAEphQG", "Timer");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Timer = function() {
      function Timer() {
        this.timer = 0;
        this.duration = 0;
        this.overhead = 0;
        this.isDone = true;
      }
      Timer.prototype.SetDuration = function(duration) {
        this.timer = this.duration = duration;
        this.overhead = 0;
        this.isDone = false;
      };
      Timer.prototype.AddTime = function(duration) {
        this.timer += duration;
        this.overhead = 0;
        this.isDone = false;
      };
      Timer.prototype.GetTime = function() {
        return this.timer;
      };
      Timer.prototype.GetTimePercent = function() {
        return this.timer / this.duration;
      };
      Timer.prototype.Reset = function() {
        this.timer = this.duration;
        this.overhead = 0;
        this.isDone = false;
      };
      Timer.prototype.IsDone = function() {
        return 0 == this.timer;
      };
      Timer.prototype.JustFinished = function() {
        if (this.timer > 0) return false;
        if (this.isDone) return false;
        this.isDone = true;
        return true;
      };
      Timer.prototype.Update = function(deltaTime) {
        if (0 == this.timer) return;
        this.timer -= deltaTime;
        if (this.timer < 0) {
          this.overhead = -this.timer;
          this.timer = 0;
        }
      };
      return Timer;
    }();
    exports.default = Timer;
    cc._RF.pop();
  }, {} ],
  VideoCamera: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5ee6ceeKBRDX7drvjupA0Ys", "VideoCamera");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var VideoCamera = function() {
      function VideoCamera() {
        this.isPortrait = window.innerWidth < window.innerHeight;
      }
      VideoCamera.prototype.Setup = function(isUseSimpeFace) {
        return __awaiter(this, void 0, void 0, function() {
          var video, options, stream;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Browser API navigator.mediaDevices.getUserMedia not available");
              video = document.getElementById("Video");
              options = {
                audio: false,
                video: {
                  facingMode: "user"
                }
              };
              if (!isUseSimpeFace) if (this.isPortrait) {
                options.video.width = 1080;
                options.video.height = 1920;
              } else {
                options.video.width = 1920;
                options.video.height = 1080;
              }
              return [ 4, navigator.mediaDevices.getUserMedia(options) ];

             case 1:
              stream = _a.sent();
              video.srcObject = stream;
              video.style.display = "none";
              video.setAttribute("webkit-playsinline", "");
              video.setAttribute("playsinline", "playsinline");
              video.setAttribute("muted", "");
              this.canvas = document.getElementById("VideoCanvas");
              this.context = this.canvas.getContext("2d");
              return [ 2, new Promise(function(resolve, reject) {
                video.onloadedmetadata = function() {
                  resolve(video);
                };
              }) ];
            }
          });
        });
      };
      VideoCamera.prototype.Init = function(isUseSimpeFace) {
        return __awaiter(this, void 0, void 0, function() {
          var video;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.Setup(isUseSimpeFace) ];

             case 1:
              video = _a.sent();
              video.play();
              return [ 2, video ];
            }
          });
        });
      };
      VideoCamera.prototype.Render = function(video) {
        var rect = {
          x: 0,
          y: 0,
          width: video.videoWidth,
          height: video.videoHeight
        };
        if (this.isPortrait) {
          var ratio = rect.height / window.innerHeight;
          this.canvas.width = Math.round(window.innerWidth * ratio);
          this.canvas.height = rect.height;
          video.width = rect.width;
          video.height = rect.height;
          var offset = (this.canvas.width - rect.width) / 2;
          this.context.rect(0, 0, this.canvas.width, this.canvas.height);
          this.context.clip();
          this.context.drawImage(video, 0, 0, rect.width, rect.height, offset, 0, rect.width, rect.height);
        } else {
          var ratio = rect.width / window.innerWidth;
          this.canvas.width = rect.width;
          this.canvas.height = Math.round(window.innerHeight * ratio);
          video.width = rect.width;
          video.height = rect.height;
          var offset = (this.canvas.height - rect.height) / 2;
          this.context.rect(0, 0, this.canvas.width, this.canvas.height);
          this.context.clip();
          this.context.drawImage(video, 0, 0, rect.width, rect.height, 0, offset, rect.width, rect.height);
        }
      };
      return VideoCamera;
    }();
    exports.default = VideoCamera;
    cc._RF.pop();
  }, {} ]
}, {}, [ "API", "Collectible", "CollectibleMgr", "Defines", "Evil", "GameMgr", "Init", "Message", "ObstacleMgr", "Player", "Rocket", "Scrollable", "Settings", "SimpleFaceDetect", "VideoCamera", "EventMgr", "Input", "QRCode", "Timer", "ML5Wrapper", "Ingame", "Loading", "MainMenu", "PopupError", "Score" ]);