System.register("chunks:///_virtual/Facebook.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(o){"use strict";var e,n,t,i,c,r;return{setters:[function(o){e=o.inheritsLoose,n=o.defineProperty,t=o.assertThisInitialized},function(o){i=o.cclegacy,c=o._decorator,r=o.Component}],execute:function(){var s;i._RF.push({},"93468vbE8JAOZjo9NkWHi2Z","Facebook",void 0);var a=c.ccclass;c.property,o("Facebook",a("Facebook")(s=function(o){function i(){for(var e,i=arguments.length,c=new Array(i),r=0;r<i;r++)c[r]=arguments[r];return e=o.call.apply(o,[this].concat(c))||this,n(t(e),"fbSDK",null),e}e(i,o);var c=i.prototype;return c.start=function(){this.fbSDK=window.FB},c.update=function(o){},c.Login=function(){var o=this;this.fbSDK.login((function(e){e.authResponse?(console.log("Welcome!  Fetching your information.... "),o.fbSDK.api("/me",(function(o){console.log("Good to see you, "+o.name+".")}))):console.log("User cancelled login or did not fully authorize.")}))},i}(r))||s);i._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./Facebook.ts"],(function(){"use strict";return{setters:[null],execute:function(){}}}));

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