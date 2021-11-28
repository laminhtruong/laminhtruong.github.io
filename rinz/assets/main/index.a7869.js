System.register("chunks:///_virtual/test.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var e,i,r,n,o,c,s,a;return{setters:[function(t){e=t.applyDecoratedDescriptor,i=t.inheritsLoose,r=t.initializerDefineProperty,n=t.assertThisInitialized},function(t){o=t.cclegacy,c=t._decorator,s=t.EditBox,a=t.Component}],execute:function(){var u,l,p,d,f;o._RF.push({},"9cbedXqN15Lo5te6i3SNoXC","test",void 0);var y=c.ccclass,h=c.property;t("Test",(u=y("Test"),l=h(s),u((f=e((d=function(t){function e(){for(var e,i=arguments.length,o=new Array(i),c=0;c<i;c++)o[c]=arguments[c];return e=t.call.apply(t,[this].concat(o))||this,r(n(e),"editBox",f,n(e)),e}i(e,t);var o=e.prototype;return o.start=function(){},o.update=function(t){this.editBox._impl._adjustWindowScroll=function(){}},e}(a)).prototype,"editBox",[l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),p=d))||p));o._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./test.ts"],(function(){"use strict";return{setters:[null],execute:function(){}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});