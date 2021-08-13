System.register("chunks:///_virtual/Map.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(e){"use strict";var t,n,i,o,a,s,r,c,u,p,l,h,g,d,f;return{setters:[function(e){t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized,a=e.defineProperty},function(e){s=e.cclegacy,r=e._decorator,c=e.Node,u=e.Label,p=e.SystemEvent,l=e.UITransform,h=e.view,g=e.clamp,d=e.Vec3,f=e.Component}],execute:function(){var m,v,M,b,y,w,T,O,U;s._RF.push({},"80ec7c3Uo5JkZwbtKMDtnyq","Map",void 0);var P=r.ccclass,E=r.property;e("Map",(m=P("Map"),v=E(c),M=E(u),b=E(u),m((T=t((w=function(e){function t(){for(var t,n=arguments.length,s=new Array(n),r=0;r<n;r++)s[r]=arguments[r];return t=e.call.apply(e,[this].concat(s))||this,i(o(t),"background",T,o(t)),i(o(t),"username",O,o(t)),i(o(t),"message",U,o(t)),a(o(t),"params",void 0),t}n(t,e);var s=t.prototype;return s.start=function(){var e=this;this.node.on(p.EventType.TOUCH_START,this.OnTouchStart,this),this.node.on(p.EventType.TOUCH_MOVE,this.OnTouchMove,this),this.node.on(p.EventType.TOUCH_END,this.OnTouchEnd,this),window.onmessage=function(t){e.message.string=JSON.stringify(t.data)},this.params=this.ParseUrl(window.location.href),this.params.username&&(this.username.string=this.params.username)},s.ParseUrl=function(e){for(var t,n=/[?&]([^=#]+)=([^&#]*)/g,i={};t=n.exec(e);)i[t[1]]=decodeURIComponent(t[2]);return i},s.UpdateMap=function(e){var t=this.background.getComponent(l).contentSize,n=this.background.position.add(e),i=(t.x-h.getVisibleSize().x)/2;n.x=g(n.x,-i,i),n.y=0,this.background.position=n},s.PostMessage=function(e){var t=window;t.ReactNativeWebView?t.ReactNativeWebView.postMessage(e):window.postMessage(e,"*")},s.OnMusic=function(){this.PostMessage({action:"RinZMusic"})},s.OnMeet=function(){this.PostMessage({action:"RinZMeet"})},s.OnHome=function(){this.PostMessage({action:"Home"})},s.OnTouchStart=function(e){console.log(e.getUILocation())},s.OnTouchMove=function(e){var t=e.getUIDelta();this.UpdateMap(new d(t.x,t.y,0))},s.OnTouchEnd=function(e){},t}(f)).prototype,"background",[v],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),O=t(w.prototype,"username",[M],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),U=t(w.prototype,"message",[b],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),y=w))||y));s._RF.pop()}}}));

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