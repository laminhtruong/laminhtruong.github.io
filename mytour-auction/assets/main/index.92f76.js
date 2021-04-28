System.register("chunks:///_virtual/Facebook.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(o){"use strict";var e,t,n,r,i,a,s,c,l;return{setters:[function(o){e=o.applyDecoratedDescriptor,t=o.inheritsLoose,n=o.initializerDefineProperty,r=o.assertThisInitialized,i=o.defineProperty},function(o){a=o.cclegacy,s=o._decorator,c=o.Label,l=o.Component}],execute:function(){var u,p,f,b,g;a._RF.push({},"93468vbE8JAOZjo9NkWHi2Z","Facebook",void 0);var y=s.ccclass,h=s.property;o("Facebook",(u=y("Facebook"),p=h({type:c}),u((g=e((b=function(o){function e(){for(var e,t=arguments.length,a=new Array(t),s=0;s<t;s++)a[s]=arguments[s];return e=o.call.apply(o,[this].concat(a))||this,n(r(e),"status",g,r(e)),i(r(e),"fbSDK",null),e}t(e,o);var a=e.prototype;return a.start=function(){this.fbSDK=window.FB},a.update=function(o){},a.Login=function(){var o=this;this.fbSDK.login((function(e){e.authResponse?(console.log("Welcome!  Fetching your information.... "),o.fbSDK.api("/me",(function(e){console.log("Good to see you, "+e.name+"."),o.status.string=e.name}))):(o.status.string="error",console.log("User cancelled login or did not fully authorize."))}))},e}(l)).prototype,"status",[p],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),f=b))||f));a._RF.pop()}}}));

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