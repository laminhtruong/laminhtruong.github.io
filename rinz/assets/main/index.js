System.register("chunks:///_virtual/Map.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(e){"use strict";var n,t,i,o,a,r,s,c,u,p,l,h,d,g,f;return{setters:[function(e){n=e.applyDecoratedDescriptor,t=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized,a=e.defineProperty},function(e){r=e.cclegacy,s=e._decorator,c=e.Node,u=e.Label,p=e.SystemEvent,l=e.UITransform,h=e.view,d=e.clamp,g=e.Vec3,f=e.Component}],execute:function(){var m,y,v,b,M,w,T,O,U;r._RF.push({},"80ec7c3Uo5JkZwbtKMDtnyq","Map",void 0);var E=s.ccclass,S=s.property;e("Map",(m=E("Map"),y=S(c),v=S(u),b=S(u),m((T=n((w=function(e){function n(){for(var n,t=arguments.length,r=new Array(t),s=0;s<t;s++)r[s]=arguments[s];return n=e.call.apply(e,[this].concat(r))||this,i(o(n),"background",T,o(n)),i(o(n),"username",O,o(n)),i(o(n),"message",U,o(n)),a(o(n),"params",void 0),n}t(n,e);var r=n.prototype;return r.start=function(){var e=this;this.node.on(p.EventType.TOUCH_START,this.OnTouchStart,this),this.node.on(p.EventType.TOUCH_MOVE,this.OnTouchMove,this),this.node.on(p.EventType.TOUCH_END,this.OnTouchEnd,this),window.onmessage=function(n){e.message.string=JSON.stringify(n.data)},this.params=this.ParseUrl(window.location.href),this.params.username&&(this.username.string=this.params.username)},r.ParseUrl=function(e){for(var n,t=/[?&]([^=#]+)=([^&#]*)/g,i={};n=t.exec(e);)i[n[1]]=decodeURIComponent(n[2]);return i},r.UpdateMap=function(e){var n=this.background.getComponent(l).contentSize,t=this.background.position.add(e),i=(n.x-h.getVisibleSize().x)/2;t.x=d(t.x,-i,i),t.y=0,this.background.position=t},r.OnMusic=function(){window.postMessage({action:"RinZMusic"},"*")},r.OnMeet=function(){window.postMessage({action:"RinZMeet"},"*")},r.OnHome=function(){window.postMessage({action:"Home"},"*")},r.OnTouchStart=function(e){console.log(e.getUILocation())},r.OnTouchMove=function(e){var n=e.getUIDelta();this.UpdateMap(new g(n.x,n.y,0))},r.OnTouchEnd=function(e){},n}(f)).prototype,"background",[y],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),O=n(w.prototype,"username",[v],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),U=n(w.prototype,"message",[b],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),M=w))||M));r._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./Map.ts"],(function(){"use strict";return{setters:[null],execute:function(){}}}));

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