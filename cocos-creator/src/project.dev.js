System.register("chunks:///SpawnMgr.js", ["./_virtual/_rollupPluginBabelHelpers.js", "cc"], function (_export, _context) {
  "use strict";

  var _applyDecoratedDescriptor, _inherits, _createClass, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Prefab, instantiate, math, Component, _dec, _dec2, _class, _class2, _descriptor, _temp, ccclass, property, SpawnMgr;

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
      _createClass = _virtual_rollupPluginBabelHelpersJs.createClass;
      _classCallCheck = _virtual_rollupPluginBabelHelpersJs.classCallCheck;
      _possibleConstructorReturn = _virtual_rollupPluginBabelHelpersJs.possibleConstructorReturn;
      _getPrototypeOf = _virtual_rollupPluginBabelHelpersJs.getPrototypeOf;
      _initializerDefineProperty = _virtual_rollupPluginBabelHelpersJs.initializerDefineProperty;
      _assertThisInitialized = _virtual_rollupPluginBabelHelpersJs.assertThisInitialized;
    }, function (_cc) {
      cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      math = _cc.math;
      Component = _cc.Component;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c80d0nWxl1Ceo3pES/7OCCb", "SpawnMgr", undefined);

      ccclass = _decorator.ccclass;
      property = _decorator.property;

      _export("SpawnMgr", SpawnMgr = (_dec = ccclass('SpawnMgr'), _dec2 = property({
        type: Prefab
      }), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
        _inherits(SpawnMgr, _Component);

        function SpawnMgr() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, SpawnMgr);

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SpawnMgr)).call.apply(_getPrototypeOf2, [this].concat(args)));

          _initializerDefineProperty(_this, "BoxPrefab", _descriptor, _assertThisInitialized(_this));

          _this.timer = 0;
          return _this;
        }

        _createClass(SpawnMgr, [{
          key: "start",
          value: function start() {// Your initialization goes here.
          }
        }, {
          key: "update",
          value: function update(deltaTime) {
            this.timer += deltaTime;

            if (this.timer > 0.05) {
              var box = instantiate(this.BoxPrefab);
              box.setPosition(math.randomRangeInt(-5, 5), math.randomRangeInt(10, 20), math.randomRangeInt(-5, 5));
              box.parent = this.node;
              this.timer = 0;
            }
          }
        }]);

        return SpawnMgr;
      }(Component), _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "BoxPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/prerequisite-imports:main", ["../SpawnMgr.js"], function (_export, _context) {
  "use strict";

  return {
    setters: [function (_SpawnMgrJs) {}],
    execute: function () {}
  };
});

(function(r) {
  r('project:///assets/SpawnMgr.js', 'chunks:///SpawnMgr.js');
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