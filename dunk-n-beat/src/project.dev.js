System.register("chunks:///Defines.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc"], function (_export, _context) {
  "use strict";

  var _classCallCheck, cclegacy, _temp, Config, BallEvent, ColliderGroup;

  function AmaReadContent(url) {
    return AmaSdk.ContentReader.getNotes(url);
  }

  _export({
    AmaReadContent: AmaReadContent,
    _temp: void 0,
    BallEvent: void 0,
    ColliderGroup: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "45f53txDeFIZrmsGVaQkohD", "Defines", undefined);

      Config = new (_temp = function Config() {
        _classCallCheck(this, Config);

        this.AUDIO_DELAY = 0;
        this.BASKET_START_Y = -1;
        this.BASKET_START_Z = 0;
        this.BALL_MAX = 20;
        this.BALL_START_Y = this.BASKET_START_Y - 8;
        this.BALL_START_Z = this.BASKET_START_Z - 25;
        this.BALL_MIDDLE_Y = 21;
        this.BALL_PERCENT_MOVE_BEZIER = 0.85;
        this.BALL_FLY_TIME = 2;
        this.BALL_INACTIVE_Y = this.BASKET_START_Y - 10;
        this.BALL_ALIGN_DURATION = 0.4;
      }, _temp)();

      (function (BallEvent) {
        BallEvent["SCORE"] = "OnScore";
        BallEvent["COLLISION_WITH_BASKET"] = "OnCollisionWithBasket";
      })(BallEvent || _export("BallEvent", BallEvent = {}));

      (function (ColliderGroup) {
        ColliderGroup[ColliderGroup["BALL"] = 1] = "BALL";
        ColliderGroup[ColliderGroup["BASKET"] = 2] = "BASKET";
      })(ColliderGroup || _export("ColliderGroup", ColliderGroup = {}));

      cclegacy._RF.pop();

      _export("default", Config);
    }
  };
});

System.register("chunks:///core/Timer.js", ["../_virtual/_rollupPluginBabelHelpers.js", "cc"], function (_export, _context) {
  "use strict";

  var _createClass, _classCallCheck, cclegacy, Timer;

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "6b85cbHB39ATpO/QtAEphQG", "Timer", undefined);

      Timer = /*#__PURE__*/function () {
        function Timer() {
          _classCallCheck(this, Timer);

          this.timer = 0;
          this.duration = 0;
          this.overhead = 0;
          this.isDone = true;
        }

        _createClass(Timer, [{
          key: "SetDuration",
          value: function SetDuration(duration) {
            this.timer = this.duration = duration;
            this.overhead = 0;
            this.isDone = false;
          }
        }, {
          key: "AddTime",
          value: function AddTime(duration) {
            this.timer += duration;
            this.overhead = 0;
            this.isDone = false;
          }
        }, {
          key: "GetTimePercent",
          value: function GetTimePercent() {
            return this.timer / this.duration;
          }
        }, {
          key: "Reset",
          value: function Reset() {
            this.timer = this.duration;
            this.overhead = 0;
            this.isDone = false;
          }
        }, {
          key: "IsDone",
          value: function IsDone() {
            return this.timer == 0;
          }
        }, {
          key: "JustFinished",
          value: function JustFinished() {
            if (this.timer > 0) {
              return false;
            }

            if (this.isDone) {
              return false;
            }

            this.isDone = true;
            return true;
          }
        }, {
          key: "Update",
          value: function Update(deltaTime) {
            if (this.timer == 0) {
              return;
            }

            this.timer -= deltaTime;

            if (this.timer < 0) {
              this.overhead = -this.timer;
              this.timer = 0;
            }
          }
        }]);

        return Timer;
      }();

      cclegacy._RF.pop();

      _export("default", Timer);
    }
  };
});

System.register("chunks:///BallMgr.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc", "./Defines.js", "./core/Timer.js", "./GameMgr.js", "./Ball.js"], function (_export, _context) {
  "use strict";

  var _applyDecoratedDescriptor, _inherits, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, Prefab, AudioSourceComponent, Node, instantiate, math, clamp, Component, Config, Timer, GameMgr, Ball, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, ccclass, property, STATE, BallMgr;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _temp: void 0,
    STATE: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _inherits = _virtual_rollupPluginBabelHelpersJs.inherits;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
      _possibleConstructorReturn = _virtual_rollupPluginBabelHelpersJs.possibleConstructorReturn;
      _getPrototypeOf = _virtual_rollupPluginBabelHelpersJs.getPrototypeOf;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Prefab = _cc.Prefab;
      AudioSourceComponent = _cc.AudioSourceComponent;
      Node = _cc.Node;
      instantiate = _cc.instantiate;
      math = _cc.math;
      clamp = _cc.clamp;
      Component = _cc.Component;
    }, function (_DefinesJs) {
      Config = _DefinesJs.default;
    }, function (_coreTimerJs) {
      Timer = _coreTimerJs.default;
    }, function (_GameMgrJs) {
      GameMgr = _GameMgrJs.default;
    }, function (_BallJs) {
      Ball = _BallJs.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "b69cb2ma7FGN4AP/vv6f0Lr", "BallMgr", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      (function (STATE) {
        STATE[STATE["NONE"] = 0] = "NONE";
        STATE[STATE["INIT"] = 1] = "INIT";
        STATE[STATE["PLAYING"] = 2] = "PLAYING";
      })(STATE || (STATE = {}));

      BallMgr = (_dec = property({
        type: Prefab
      }), _dec2 = property({
        type: AudioSourceComponent
      }), _dec3 = property({
        type: Node
      }), ccclass(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inherits(BallMgr, _Component);

        function BallMgr() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, BallMgr);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BallMgr)).call.apply(_getPrototypeOf2, [this].concat(args)));

          _initializerDefineProperty(_this, "ballPrefab", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "mainAudio", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "basket", _descriptor3, _assertThisInitialized(_this));

          _this.timerDelay = new Timer();
          _this.balls = [];
          _this.ballThrowOffset = [];
          _this.ballThrowPosition = [];
          _this.currentTime = 0;
          _this.noteIndex = 0;
          _this.minX = -3;
          _this.maxX = 3;
          return _this;
        }

        _createClass(BallMgr, [{
          key: "onLoad",
          value: function onLoad() {}
        }, {
          key: "start",
          value: function start() {}
        }, {
          key: "update",
          value: function update(deltaTime) {
            switch (this.state) {
              case STATE.NONE:
                break;

              case STATE.INIT:
                break;

              case STATE.PLAYING:
                this.timerDelay.Update(deltaTime);

                if (this.timerDelay.JustFinished()) {
                  this.mainAudio.play();
                }

                this.UpdateMakeBall(deltaTime);
                break;
            }
          }
        }, {
          key: "SetState",
          value: function SetState(state) {
            this.state = state;

            switch (state) {
              case STATE.NONE:
                break;

              case STATE.INIT:
                this.GenerateBallThrowPosition();
                this.flyTime = Config.BALL_FLY_TIME;
                this.currentTime = this.notes[this.noteIndex].time - this.flyTime;
                var audioPlayAtTime = Math.max(this.currentTime, 0 - Config.AUDIO_DELAY);
                var audioStartTime = audioPlayAtTime + Config.AUDIO_DELAY;
                this.mainAudio.currentTime = audioStartTime;
                this.timerDelay.SetDuration(audioPlayAtTime - this.currentTime);

                if (this.balls.length == 0) {
                  for (var i = 0; i < Config.BALL_MAX; i++) {
                    var objectBall = instantiate(this.ballPrefab);
                    objectBall.parent = this.node;
                    var ball = objectBall.getComponent(Ball);
                    ball.basket = this.basket;
                    this.balls.push(objectBall);
                  }
                }

                break;
            }
          }
        }, {
          key: "Init",
          value: function Init() {
            this.SetState(STATE.INIT);
          }
        }, {
          key: "Play",
          value: function Play() {
            this.SetState(STATE.PLAYING);
          }
        }, {
          key: "UpdateMakeBall",
          value: function UpdateMakeBall(deltaTime) {
            this.currentTime += deltaTime;

            if (this.noteIndex < this.notes.length) {
              // let duration = this.noteIndex == 0 ? 1 : this.notes[this.noteIndex].time - this.notes[this.noteIndex - 1].time;
              if (this.currentTime >= this.notes[this.noteIndex].time - this.flyTime) {
                this.Throw(this.noteIndex++);
              }
            }
          }
        }, {
          key: "SetNotes",
          value: function SetNotes(notes) {
            this.notes = notes.filter(function (note) {
              return note.name == "D#5";
            });
          }
        }, {
          key: "GetBallThrowOffset",
          value: function GetBallThrowOffset(noteIndex) {
            var duration = noteIndex == 0 ? 0 : this.notes[noteIndex].time - this.notes[noteIndex - 1].time;
            var offset = (duration > Config.BALL_ALIGN_DURATION ? duration * 5 : 0) * math.randomRange(0.3, 1);
            var percent = this.noteIndex / this.notes.length;
            var percentEasy = 0.3;

            if (percent < 0.5) {
              var divide = 5 * (percentEasy - percent);
              offset /= clamp(divide, 1, divide);
            }

            return offset;
          }
        }, {
          key: "GenerateBallThrowOffset",
          value: function GenerateBallThrowOffset() {
            for (var i = 0; i < this.notes.length; i++) {
              var offset = i <= this.noteIndex ? 0 : this.GetBallThrowOffset(i);
              this.ballThrowOffset[i] = offset;
            }
          }
        }, {
          key: "GenerateBallThrowPosition",
          value: function GenerateBallThrowPosition() {
            this.GenerateBallThrowOffset();

            for (var i = 0; i < this.notes.length; i++) {
              if (i == 0 || i <= this.noteIndex) {
                this.ballThrowPosition[i] = 0;
              } else {
                var offset = this.ballThrowOffset[i];
                var lastX = this.ballThrowPosition[i - 1];
                var sign = math.randomRange(0, 1) > (lastX - this.minX) / (this.maxX - this.minX) ? 1 : -1;
                offset *= sign;
                this.ballThrowPosition[i] = clamp(lastX + offset, this.minX, this.maxX);
              }
            }
          }
        }, {
          key: "GetInactiveBall",
          value: function GetInactiveBall() {
            for (var i = 0; i < Config.BALL_MAX; i++) {
              var ball = this.balls[i].getComponent(Ball);

              if (ball.IsInactive()) {
                return this.balls[i];
              }
            }

            return null;
          }
        }, {
          key: "Throw",
          value: function Throw(noteIndex) {
            var objectBall = this.GetInactiveBall();

            if (objectBall != null) {
              objectBall.getComponent(Ball).Throw(this.ballThrowPosition[noteIndex], this.minX, this.maxX, GameMgr.instance.combo);
            }
          }
        }]);

        return BallMgr;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ballPrefab", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mainAudio", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "basket", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class);

      cclegacy._RF.pop();

      _export("default", BallMgr);
    }
  };
});

System.register("chunks:///core/Input.js", ["../_virtual/_rollupPluginBabelHelpers.js", "cc"], function (_export, _context) {
  "use strict";

  var _inherits, _createClass, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf, cclegacy, Node, Vec2, Component, _class, _class2, _temp, _cc$_decorator, ccclass, property, Input;

  _export({
    _class: void 0,
    _class2: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _inherits = _virtual_rollupPluginBabelHelpersJs.inherits;
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
      _possibleConstructorReturn = _virtual_rollupPluginBabelHelpersJs.possibleConstructorReturn;
      _getPrototypeOf = _virtual_rollupPluginBabelHelpersJs.getPrototypeOf;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      Node = _cc.Node;
      Vec2 = _cc.Vec2;
      Component = _cc.Component;
    }],
    execute: function () {
      cclegacy._RF.push({}, "86a1eETgqhC7LCRoYW35gpp", "Input", undefined);

      _cc$_decorator = cc._decorator;
      ccclass = _cc$_decorator.ccclass;
      property = _cc$_decorator.property;
      Input = ccclass(_class = (_temp = _class2 = /*#__PURE__*/function (_Component) {
        _inherits(Input, _Component);

        function Input() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, Input);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Input)).call.apply(_getPrototypeOf2, [this].concat(args)));
          _this.position = new Vec2(0, 0);
          _this.prevPosition = new Vec2(0, 0);
          _this.delta = new Vec2(0, 0);
          _this.isHold = false;
          return _this;
        }

        _createClass(Input, [{
          key: "onLoad",
          value: function onLoad() {
            Input.instance = this;
            this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          }
        }, {
          key: "start",
          value: function start() {}
        }, {
          key: "update",
          value: function update(deltaTime) {
            if (this.isHold) {
              cc.Vec2.subtract(this.delta, this.position, this.prevPosition);
              this.prevPosition = this.position;
            }
          }
        }, {
          key: "onTouchStart",
          value: function onTouchStart(event) {
            this.position = event.touch.getLocation();
            this.prevPosition = event.touch.getLocation();
            this.isHold = true;
          }
        }, {
          key: "onTouchEnd",
          value: function onTouchEnd(event) {
            this.delta = new cc.Vec2(0, 0);
            this.isHold = false;
          }
        }, {
          key: "onTouchMove",
          value: function onTouchMove(event) {
            this.position = event.touch.getLocation();
          }
        }]);

        return Input;
      }(Component), _class2.instance = null, _temp)) || _class;

      cclegacy._RF.pop();

      _export("default", Input);
    }
  };
});

System.register("chunks:///Basket.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc", "./Defines.js", "./core/Input.js"], function (_export, _context) {
  "use strict";

  var _applyDecoratedDescriptor, _inherits, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, Node, ColliderComponent, lerp, clamp, math, tween, Vec3, ParticleSystemComponent, Component, ColliderGroup, Input, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _temp, ccclass, property, STATE, Basket;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _temp: void 0,
    STATE: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _inherits = _virtual_rollupPluginBabelHelpersJs.inherits;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
      _possibleConstructorReturn = _virtual_rollupPluginBabelHelpersJs.possibleConstructorReturn;
      _getPrototypeOf = _virtual_rollupPluginBabelHelpersJs.getPrototypeOf;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Node = _cc.Node;
      ColliderComponent = _cc.ColliderComponent;
      lerp = _cc.lerp;
      clamp = _cc.clamp;
      math = _cc.math;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
      ParticleSystemComponent = _cc.ParticleSystemComponent;
      Component = _cc.Component;
    }, function (_DefinesJs) {
      ColliderGroup = _DefinesJs.ColliderGroup;
    }, function (_coreInputJs) {
      Input = _coreInputJs.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3392a5tZUFJAZwWtbhZA1/m", "Basket", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      (function (STATE) {
        STATE[STATE["NONE"] = 0] = "NONE";
        STATE[STATE["INIT"] = 1] = "INIT";
        STATE[STATE["PLAYING"] = 2] = "PLAYING";
      })(STATE || (STATE = {}));

      Basket = (_dec = property({
        type: Node
      }), _dec2 = property({
        type: [Node]
      }), ccclass(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inherits(Basket, _Component);

        function Basket() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, Basket);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Basket)).call.apply(_getPrototypeOf2, [this].concat(args)));

          _initializerDefineProperty(_this, "main", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "effects", _descriptor2, _assertThisInitialized(_this));

          return _this;
        }

        _createClass(Basket, [{
          key: "onLoad",
          value: function onLoad() {}
        }, {
          key: "start",
          value: function start() {
            var Collider = this.getComponentsInChildren(ColliderComponent);

            for (var i = 0; i < Collider.length; i++) {
              Collider[i].setGroup(ColliderGroup.BASKET);
              Collider[i].setMask(ColliderGroup.BALL);
            }
          }
        }, {
          key: "update",
          value: function update(deltaTime) {
            switch (this.state) {
              case STATE.NONE:
                break;

              case STATE.INIT:
                break;

              case STATE.PLAYING:
                if (Input.instance.isHold) {
                  var x = lerp(this.node.position.x, this.node.position.x + Input.instance.delta.x, deltaTime);
                  x = clamp(x, -3, 3);
                  this.node.setPosition(x, this.node.position.y, this.node.position.z);
                }

                break;
            }
          }
        }, {
          key: "SetState",
          value: function SetState(state) {
            this.state = state;

            switch (this.state) {
              case STATE.NONE:
                break;

              case STATE.INIT:
                break;

              case STATE.PLAYING:
                break;
            }
          }
        }, {
          key: "Init",
          value: function Init() {
            this.SetState(STATE.INIT);
          }
        }, {
          key: "Play",
          value: function Play() {
            this.SetState(STATE.PLAYING);
          }
        }, {
          key: "Shake",
          value: function Shake(strength) {
            this.main.setPosition(math.randomRange(-strength.x, strength.x), strength.y, math.randomRange(-strength.z, strength.z));
            tween(this.main).stop();
            tween(this.main).to(0.5, {
              position: Vec3.ZERO
            }, {
              easing: "elasticOut"
            }).start();
          }
        }, {
          key: "Flash",
          value: function Flash(isPerfect) {
            if (!isPerfect) {
              var particles = this.effects[0].getComponentsInChildren(ParticleSystemComponent);

              for (var i = 0; i < particles.length; i++) {
                particles[i].stop();
                particles[i].play();
              }
            } else {
              var _particles = this.effects[1].getComponentsInChildren(ParticleSystemComponent);

              for (var _i = 0; _i < _particles.length; _i++) {
                _particles[_i].stop();

                _particles[_i].play();
              }
            }
          }
        }]);

        return Basket;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "main", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "effects", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class);

      cclegacy._RF.pop();

      _export("default", Basket);
    }
  };
});

System.register("chunks:///GameMgr.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc", "./Defines.js", "./BallMgr.js", "./core/Input.js", "./Basket.js"], function (_export, _context) {
  "use strict";

  var _applyDecoratedDescriptor, _inherits, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, AudioSourceComponent, EventTarget, PhysicsSystem, Vec3, loader, Component, BallEvent, AmaReadContent, BallMgr, Input, Basket, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, _cc$_decorator, ccclass, property, STATE, GameMgr;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _dec3: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _descriptor2: void 0,
    _descriptor3: void 0,
    _temp: void 0,
    STATE: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _inherits = _virtual_rollupPluginBabelHelpersJs.inherits;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
      _possibleConstructorReturn = _virtual_rollupPluginBabelHelpersJs.possibleConstructorReturn;
      _getPrototypeOf = _virtual_rollupPluginBabelHelpersJs.getPrototypeOf;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      AudioSourceComponent = _cc.AudioSourceComponent;
      EventTarget = _cc.EventTarget;
      PhysicsSystem = _cc.PhysicsSystem;
      Vec3 = _cc.Vec3;
      loader = _cc.loader;
      Component = _cc.Component;
    }, function (_DefinesJs) {
      BallEvent = _DefinesJs.BallEvent;
      AmaReadContent = _DefinesJs.AmaReadContent;
    }, function (_BallMgrJs) {
      BallMgr = _BallMgrJs.default;
    }, function (_coreInputJs) {
      Input = _coreInputJs.default;
    }, function (_BasketJs) {
      Basket = _BasketJs.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "0afcbVbyR9PZLYJkXDtYNU8", "GameMgr", undefined);

      _cc$_decorator = cc._decorator;
      ccclass = _cc$_decorator.ccclass;
      property = _cc$_decorator.property;

      (function (STATE) {
        STATE[STATE["INIT"] = 0] = "INIT";
        STATE[STATE["LOADING"] = 1] = "LOADING";
        STATE[STATE["LOADING_ERROR"] = 2] = "LOADING_ERROR";
        STATE[STATE["TOUCH_TO_PLAY"] = 3] = "TOUCH_TO_PLAY";
        STATE[STATE["PLAYING"] = 4] = "PLAYING";
      })(STATE || (STATE = {}));

      GameMgr = (_dec = property({
        type: BallMgr
      }), _dec2 = property({
        type: Basket
      }), _dec3 = property({
        type: AudioSourceComponent
      }), ccclass(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inherits(GameMgr, _Component);

        function GameMgr() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, GameMgr);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(GameMgr)).call.apply(_getPrototypeOf2, [this].concat(args)));

          _initializerDefineProperty(_this, "ballMgr", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "basket", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "mainAudio", _descriptor3, _assertThisInitialized(_this));

          _this.eventTarget = new EventTarget();
          _this.combo = 0;
          return _this;
        }

        _createClass(GameMgr, [{
          key: "onLoad",
          value: function onLoad() {
            GameMgr.instance = this;
            PhysicsSystem.instance.gravity = new Vec3(0, -40, 0);
          }
        }, {
          key: "start",
          value: function start() {
            this.Init();
            this.EventOn(BallEvent.SCORE, this.OnScore, this);
          }
        }, {
          key: "update",
          value: function update(deltaTime) {
            switch (this.state) {
              case STATE.INIT:
                break;

              case STATE.LOADING:
                break;

              case STATE.LOADING_ERROR:
                break;

              case STATE.TOUCH_TO_PLAY:
                if (Input.instance.isHold) {
                  this.ballMgr.Play();
                  this.basket.Play();
                  this.SetState(STATE.PLAYING);
                }

                break;

              case STATE.PLAYING:
                break;
            }
          }
        }, {
          key: "SetState",
          value: function SetState(state) {
            var _this2 = this;

            this.state = state;

            switch (state) {
              case STATE.INIT:
                this.SetState(STATE.LOADING);
                break;

              case STATE.LOADING:
                loader.load("https://d1wkdokb986dq4.cloudfront.net/testing/songs/tinh-phai.mp3", function (error, clip) {
                  if (error == null) {
                    _this2.mainAudio.clip = clip;
                    AmaReadContent("https://d1wkdokb986dq4.cloudfront.net/testing/songs/tinh-phai.bin").then(function (notes) {
                      _this2.ballMgr.SetNotes(notes);

                      _this2.SetState(STATE.TOUCH_TO_PLAY);
                    })["catch"](function (error) {
                      _this2.SetState(STATE.LOADING_ERROR);
                    });
                  } else {
                    _this2.SetState(STATE.LOADING_ERROR);
                  }
                });
                break;

              case STATE.LOADING_ERROR:
                break;

              case STATE.TOUCH_TO_PLAY:
                this.ballMgr.Init();
                this.basket.Init();
                break;
            }
          }
        }, {
          key: "Init",
          value: function Init() {
            this.SetState(STATE.INIT);
          }
        }, {
          key: "OnScore",
          value: function OnScore(args) {
            console.log("Miss: " + args.miss, "Perfect:" + args.perfect);

            if (!args.miss) {
              if (!args.perfect) {
                this.basket.Shake(new Vec3(0.1, -0.2, 0.1));
              } else {
                this.basket.Shake(new Vec3(0.2, -0.5, 0.2));
              }

              this.basket.Flash(args.perfect);
              this.combo++;
            } else {
              this.combo = 0;
            }
          }
        }, {
          key: "EventOn",
          value: function EventOn(type, callback, target) {
            this.eventTarget.on(type, callback, target);
          }
        }, {
          key: "EventOff",
          value: function EventOff(type, callback, target) {
            this.eventTarget.on(type, callback, target);
          }
        }, {
          key: "EventEmit",
          value: function EventEmit(key, args) {
            this.eventTarget.emit(key, args);
          }
        }]);

        return GameMgr;
      }(Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ballMgr", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "basket", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "mainAudio", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class);

      cclegacy._RF.pop();

      _export("default", GameMgr);
    }
  };
});

System.register("chunks:///Ball.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc", "./Defines.js", "./GameMgr.js"], function (_export, _context) {
  "use strict";

  var _applyDecoratedDescriptor, _inherits, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, Node, ColliderComponent, Vec3, math, PhysicsSystem, RigidBodyComponent, Component, Config, ColliderGroup, BallEvent, GameMgr, _dec, _class, _class2, _descriptor, _temp, ccclass, property, STATE, Ball;

  _export({
    _dec: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0,
    STATE: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _inherits = _virtual_rollupPluginBabelHelpersJs.inherits;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
      _possibleConstructorReturn = _virtual_rollupPluginBabelHelpersJs.possibleConstructorReturn;
      _getPrototypeOf = _virtual_rollupPluginBabelHelpersJs.getPrototypeOf;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Node = _cc.Node;
      ColliderComponent = _cc.ColliderComponent;
      Vec3 = _cc.Vec3;
      math = _cc.math;
      PhysicsSystem = _cc.PhysicsSystem;
      RigidBodyComponent = _cc.RigidBodyComponent;
      Component = _cc.Component;
    }, function (_DefinesJs) {
      Config = _DefinesJs.default;
      ColliderGroup = _DefinesJs.ColliderGroup;
      BallEvent = _DefinesJs.BallEvent;
    }, function (_GameMgrJs) {
      GameMgr = _GameMgrJs.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "50312a6y8RD8bBn7w0FtWuT", "Ball", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      (function (STATE) {
        STATE[STATE["INIT"] = 0] = "INIT";
        STATE[STATE["MOVE_BEZIER"] = 1] = "MOVE_BEZIER";
        STATE[STATE["MOVE_FREE"] = 2] = "MOVE_FREE";
        STATE[STATE["INACTIVE"] = 3] = "INACTIVE";
        STATE[STATE["COLLECT_NORMAL"] = 4] = "COLLECT_NORMAL";
        STATE[STATE["COLLECT_PERFECT"] = 5] = "COLLECT_PERFECT";
        STATE[STATE["COLLECT_MISS"] = 6] = "COLLECT_MISS";
      })(STATE || (STATE = {}));

      Ball = (_dec = property({
        type: [Node]
      }), ccclass(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inherits(Ball, _Component);

        function Ball() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, Ball);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Ball)).call.apply(_getPrototypeOf2, [this].concat(args)));

          _initializerDefineProperty(_this, "effects", _descriptor, _assertThisInitialized(_this));

          _this.arrMoveByBezierX = [];
          _this.arrMoveByBezierY = [Config.BALL_START_Y, Config.BALL_MIDDLE_Y + 0.5 * (Config.BALL_START_Y + Config.BASKET_START_Y), Config.BASKET_START_Y];
          _this.arrMoveByBezierZ = [Config.BALL_START_Z, Config.BALL_START_Z + 0.8 * (Config.BASKET_START_Z - Config.BALL_START_Z), Config.BASKET_START_Z];
          _this.state = STATE.INACTIVE;
          _this.comboStage = [1, 3, 5, 10, 15];
          _this.percent = 0;
          _this.flyTime = 2;
          _this.isPerfect = true;
          _this.isCollected = false;
          return _this;
        }

        _createClass(Ball, [{
          key: "onLoad",
          value: function onLoad() {
            this.node.active = false;
          }
        }, {
          key: "start",
          value: function start() {
            var Collider = this.getComponent(ColliderComponent);
            Collider.setGroup(ColliderGroup.BALL);
            Collider.setMask(ColliderGroup.BASKET);
            Collider.on('onCollisionEnter', this.onCollision, this);
            Collider.on('onTriggerEnter', this.onTrigger, this);
          }
        }, {
          key: "update",
          value: function update(deltaTime) {
            var rotate = new Vec3(this.rotateSpeed).multiplyScalar(deltaTime);
            rotate.add(this.node.eulerAngles);

            switch (this.state) {
              case STATE.INIT:
                break;

              case STATE.MOVE_BEZIER:
                this.node.eulerAngles = rotate;
                this.UpdateMoveBezier(deltaTime);

                if (this.percent >= Config.BALL_PERCENT_MOVE_BEZIER) {
                  this.SetState(STATE.MOVE_FREE);
                }

                break;

              case STATE.MOVE_FREE:
                this.node.eulerAngles = rotate;

                if (this.isCollected) {
                  this.SetState(this.isPerfect ? STATE.COLLECT_PERFECT : STATE.COLLECT_NORMAL);
                  break;
                }

                if (this.CheckMiss()) {
                  this.SetState(STATE.COLLECT_MISS);
                }

                break;

              case STATE.COLLECT_MISS:
              case STATE.COLLECT_NORMAL:
              case STATE.COLLECT_PERFECT:
                if (this.node.position.y < Config.BALL_INACTIVE_Y) {
                  this.SetState(STATE.INACTIVE);
                }

              case STATE.INACTIVE:
                break;
            }
          }
        }, {
          key: "onCollision",
          value: function onCollision(event) {
            switch (this.state) {
              case STATE.MOVE_FREE:
                if (event.otherCollider.node.name.indexOf("Collider") != -1) {
                  GameMgr.instance.EventEmit(BallEvent.COLLISION_WITH_BASKET, {});
                  this.isPerfect = false;
                }

                break;
            }
          }
        }, {
          key: "onTrigger",
          value: function onTrigger(event) {
            switch (this.state) {
              case STATE.MOVE_FREE:
                var radius = this.node.scale.x;

                if (this.node.position.x > this.basket.position.x - 0.5 * radius && this.node.position.x < this.basket.position.x + 0.5 * radius) {
                  this.isCollected = true;
                }

                break;
            }
          }
        }, {
          key: "SetState",
          value: function SetState(state) {
            this.state = state;

            switch (state) {
              case STATE.INIT:
                this.isPerfect = true;
                this.isCollected = false;
                this.node.active = true;
                this.SetState(STATE.MOVE_BEZIER);
                break;

              case STATE.MOVE_BEZIER:
                this.percent = 0;
                this.rigidbody.isKinematic = true;
                this.arrMoveByBezierX[0] = this.node.position.x;
                this.SetEffect(this.combo);
                this.rotateSpeed = new Vec3(math.randomRange(300, 400), math.randomRange(-100, 100), math.randomRange(-100, 100));
                break;

              case STATE.MOVE_FREE:
                var target = new Vec3(this.node.position.x, Config.BASKET_START_Y, Config.BASKET_START_Z);
                var distance = target.subtract(this.node.position);
                var time = (1 - Config.BALL_PERCENT_MOVE_BEZIER) * this.flyTime;
                this.rigidbody.setLinearVelocity(distance.multiplyScalar(1 / time).add(new Vec3(0, Math.abs(PhysicsSystem.instance.gravity.y), 0).multiplyScalar(0.5 * time)));
                this.rigidbody.isKinematic = false;
                this.rigidbody.wakeUp();
                break;

              case STATE.COLLECT_MISS:
                GameMgr.instance.EventEmit(BallEvent.SCORE, {
                  miss: true,
                  perfect: false
                });
                break;

              case STATE.COLLECT_NORMAL:
                GameMgr.instance.EventEmit(BallEvent.SCORE, {
                  miss: false,
                  perfect: false
                });
                break;

              case STATE.COLLECT_PERFECT:
                GameMgr.instance.EventEmit(BallEvent.SCORE, {
                  miss: false,
                  perfect: true
                });
                break;

              case STATE.INACTIVE:
                this.rigidbody.sleep();
                break;
            }
          }
        }, {
          key: "Throw",
          value: function Throw(x, min, max, combo) {
            this.minX = min;
            this.maxX = max;
            this.combo = combo;
            this.rigidbody = this.getComponent(RigidBodyComponent);
            this.node.setPosition(x, Config.BALL_START_Y, Config.BALL_START_Z);
            this.SetState(STATE.INIT);
          }
        }, {
          key: "SetEffect",
          value: function SetEffect(combo) {
            var effectType = -1;

            for (var i = 0; i < this.comboStage.length; i++) {
              if (combo >= this.comboStage[i]) {
                effectType++;
              }
            }

            for (var _i = 0; _i < this.effects.length; _i++) {
              this.effects[_i].active = _i <= effectType;
            }
          }
        }, {
          key: "IsInactive",
          value: function IsInactive() {
            return this.state == STATE.INACTIVE;
          }
        }, {
          key: "CheckMiss",
          value: function CheckMiss() {
            var radius = this.node.scale.x;
            var position = this.node.position;
            var velocity = new Vec3(0, 0, 0);
            this.rigidbody.getLinearVelocity(velocity);
            return position.y < this.basket.position.y && (position.x < this.basket.position.x - radius || position.x > this.basket.position.x + radius || position.z < this.basket.position.z - radius || position.z > this.basket.position.z + radius) || position.y <= this.basket.position.y - 1 || position.z < this.basket.position.z - radius && velocity.z < 0 || position.z > this.basket.position.z + radius && velocity.z > 0 || position.x < this.minX - radius || position.x > this.maxX + radius;
          }
        }, {
          key: "UpdateMoveBezier",
          value: function UpdateMoveBezier(deltaTime) {
            this.percent = this.MoveToTarget(this.percent, Config.BALL_PERCENT_MOVE_BEZIER, 1 / this.flyTime, deltaTime);
            this.node.setPosition(this.Bezier(this.percent, this.arrMoveByBezierX), this.Bezier(this.percent, this.arrMoveByBezierY), this.Bezier(this.percent, this.arrMoveByBezierZ));
          }
        }, {
          key: "MoveToTarget",
          value: function MoveToTarget(current, target, speed, deltaTime) {
            speed = Math.abs(speed);
            return current < target ? Math.min(current + speed * deltaTime, target) : current > target ? Math.max(current - speed * deltaTime, target) : current;
          }
        }, {
          key: "Bezier2P",
          value: function Bezier2P(t, array, i1, i2) {
            var length = i2 - i1 + 1;
            if (length > 2) return (1 - t) * this.Bezier2P(t, array, i1, i2 - 1) + t * this.Bezier2P(t, array, i1 + 1, i2);else if (length >= 2) return (1 - t) * array[i1] + t * array[i2];else if (length >= 1) return array[i1];else return 0;
          }
        }, {
          key: "Bezier1P",
          value: function Bezier1P(t, array, i1) {
            return this.Bezier2P(t, array, i1, array.length - 1);
          }
        }, {
          key: "Bezier",
          value: function Bezier(t, array) {
            return this.Bezier2P(t, array, 0, array.length - 1);
          }
        }]);

        return Ball;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "effects", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _class2)) || _class);

      cclegacy._RF.pop();

      _export("default", Ball);
    }
  };
});

System.register("chunks:///ui/Background.js", ["../_virtual/_rollupPluginBabelHelpers.js", "cc", "../core/Timer.js"], function (_export, _context) {
  "use strict";

  var _applyDecoratedDescriptor, _inherits, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, SpriteComponent, math, Color, tween, Component, Timer, _dec, _dec2, _class, _class2, _descriptor, _temp, ccclass, property, Background;

  _export({
    _dec: void 0,
    _dec2: void 0,
    _class: void 0,
    _class2: void 0,
    _descriptor: void 0,
    _temp: void 0
  });

  return {
    setters: [function (_virtual_rollupPluginBabelHelpersJs) {
      _applyDecoratedDescriptor = _virtual_rollupPluginBabelHelpersJs.applyDecoratedDescriptor;
      _inherits = _virtual_rollupPluginBabelHelpersJs.inherits;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
      _possibleConstructorReturn = _virtual_rollupPluginBabelHelpersJs.possibleConstructorReturn;
      _getPrototypeOf = _virtual_rollupPluginBabelHelpersJs.getPrototypeOf;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      SpriteComponent = _cc.SpriteComponent;
      math = _cc.math;
      Color = _cc.Color;
      tween = _cc.tween;
      Component = _cc.Component;
    }, function (_coreTimerJs) {
      Timer = _coreTimerJs.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "1e1d6UA2yRHB6vSyJPoF+qX", "Background", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      _export("Background", Background = (_dec = ccclass('Background'), _dec2 = property({
        type: [SpriteComponent]
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inherits(Background, _Component);

        function Background() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, Background);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Background)).call.apply(_getPrototypeOf2, [this].concat(args)));

          _initializerDefineProperty(_this, "Backgrounds", _descriptor, _assertThisInitialized(_this));

          _this.timer = new Timer();
          return _this;
        }

        _createClass(Background, [{
          key: "start",
          value: function start() {
            this.timer.SetDuration(5);
            this.StartBg(-1, true);
          }
        }, {
          key: "update",
          value: function update(deltaTime) {
            this.timer.Update(deltaTime);

            if (this.timer.IsDone()) {
              this.Fade();
              this.timer.Reset();
            }
          }
        }, {
          key: "StartBg",
          value: function StartBg(lastIndex, isFirstLaunch) {
            this.currentIndex = lastIndex < 0 ? math.randomRangeInt(0, this.Backgrounds.length) : (lastIndex + 1) % this.Backgrounds.length;

            if (isFirstLaunch) {
              this.currentIndex = 0;
            }

            for (var i = 0; i < this.Backgrounds.length; i++) {
              if (i == this.currentIndex) {
                this.Backgrounds[i].color = new Color(255, 255, 255, 255);
              } else {
                this.Backgrounds[i].color = new Color(255, 255, 255, 0);
              }
            }
          }
        }, {
          key: "Fade",
          value: function Fade() {
            var current = this.currentIndex;
            var next = this.currentIndex + 1;

            if (next >= this.Backgrounds.length) {
              next = 0;
            }

            tween(this.Backgrounds[current]).to(2, {
              color: {
                r: 255,
                g: 255,
                b: 255,
                a: 0
              }
            }, {
              easing: "linear"
            }).start();
            tween(this.Backgrounds[next]).to(2, {
              color: {
                r: 255,
                g: 255,
                b: 255,
                a: 255
              }
            }, {
              easing: "linear"
            }).start();
            this.currentIndex = next;
          }
        }, {
          key: "GetCurrentIndex",
          value: function GetCurrentIndex() {
            return this.currentIndex;
          }
        }]);

        return Background;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "Backgrounds", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/prerequisite-imports:main", ["../Defines.js", "../core/Timer.js", "../BallMgr.js", "../core/Input.js", "../Basket.js", "../GameMgr.js", "../Ball.js", "../ui/Background.js"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_DefinesJs) {}, function (_coreTimerJs) {}, function (_BallMgrJs) {}, function (_coreInputJs) {}, function (_BasketJs) {}, function (_GameMgrJs) {}, function (_BallJs) {}, function (_uiBackgroundJs) {}],
    execute: function () {}
  };
});

(function(r) {
  r('project:///assets/maingame/scripts/Defines.js', 'chunks:///Defines.js');
  r('project:///assets/maingame/scripts/core/Timer.js', 'chunks:///core/Timer.js');
  r('project:///assets/maingame/scripts/BallMgr.js', 'chunks:///BallMgr.js');
  r('project:///assets/maingame/scripts/core/Input.js', 'chunks:///core/Input.js');
  r('project:///assets/maingame/scripts/Basket.js', 'chunks:///Basket.js');
  r('project:///assets/maingame/scripts/GameMgr.js', 'chunks:///GameMgr.js');
  r('project:///assets/maingame/scripts/Ball.js', 'chunks:///Ball.js');
  r('project:///assets/maingame/scripts/ui/Background.js', 'chunks:///ui/Background.js');
  r('virtual:///prerequisite-imports:main', 'chunks:///_virtual/prerequisite-imports:main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    var _m;
    return {
        setters: [function(m) { _m = m; }],
        execute: function () { _export(_m); }
    };
    });
});