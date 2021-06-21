System.register("chunks:///_virtual/QRCode.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var o,e,i,r,n,c,a,h,l;return{setters:[function(t){o=t.inheritsLoose,e=t.defineProperty,i=t.assertThisInitialized},function(t){r=t.cclegacy,n=t._decorator,c=t.Graphics,a=t.UITransform,h=t.Color,l=t.Component}],execute:function(){var s;r._RF.push({},"62f9dA4X5tCuJJ+SMkpWGmu","QRCode",void 0);var u=n.ccclass;n.property,t("QRCode",u(s=function(t){function r(){for(var o,r=arguments.length,n=new Array(r),c=0;c<r;c++)n[c]=arguments[c];return o=t.call.apply(t,[this].concat(n))||this,e(i(o),"ctx",void 0),o}o(r,t);var n=r.prototype;return n.onLoad=function(){this.ctx=this.node.getComponent(c)},n.update=function(t){},n.CreateQR=function(t){var o=new window.qrcode(-1,"L");o.addData(t),o.make();var e=this.node.getComponent(a).contentSize;this.ctx.fillColor=h.WHITE,this.ctx.rect(-e.width/2,-e.height/2,e.width,e.height),this.ctx.fill();for(var i=e.width/o.getModuleCount(),r=e.height/o.getModuleCount(),n=0;n<o.getModuleCount();n++)for(var c=0;c<o.getModuleCount();c++)if(o.isDark(n,c)){var l=Math.ceil((c+1)*i)-Math.floor(c*i),s=Math.ceil((n+1)*i)-Math.floor(n*i);this.ctx.fillColor=h.BLACK,this.ctx.rect(Math.round(c*i)-e.width/2,Math.round(n*r)-e.height/2,l,s),this.ctx.fill()}},r}(l))||s);r._RF.pop()}}}));

System.register("chunks:///_virtual/GameMgr.ts",["./_rollupPluginModLoBabelHelpers.js","cc","./QRCode.ts"],(function(e){"use strict";var t,r,i,n,a,s,o,c,u,l,h;return{setters:[function(e){t=e.applyDecoratedDescriptor,r=e.inheritsLoose,i=e.initializerDefineProperty,n=e.assertThisInitialized,a=e.defineProperty},function(e){s=e.cclegacy,o=e._decorator,c=e.Node,u=e.Vec3,l=e.Component},function(e){h=e.QRCode}],execute:function(){var p,m,f,d,v,g,b,P,y;s._RF.push({},"980f3AafxNK36ipk+geXF5p","GameMgr",void 0);var w=o.ccclass,R=o.property;e("GameMgr",(p=w("GameMgr"),m=R(c),f=R(h),d=R([c]),p((b=t((g=function(e){function t(){for(var t,r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return t=e.call.apply(e,[this].concat(s))||this,i(n(t),"aim",b,n(t)),i(n(t),"qrcode",P,n(t)),i(n(t),"items",y,n(t)),a(n(t),"target",void 0),a(n(t),"userParams",{}),a(n(t),"channel",void 0),t}r(t,e);var s=t.prototype;return s.start=function(){var e=this;this.UpdateParams();var t=new window.Pusher("14a0ba1af62c520bdce4",{cluster:"ap1"});this.channel=t.subscribe("private-gameloft"),this.userParams.server&&(this.qrcode.CreateQR("https://laminhtruong.github.io/pusher-demo/index.html"),this.channel.bind("client-move",(function(t){e.Select(null,t)}))),this.qrcode.node.parent.active=this.userParams.server,this.aim.active=this.userParams.server},s.update=function(e){if(null!=this.target){var t=new u(0,0,0);u.lerp(t,this.aim.position,this.target,.1),this.aim.setPosition(t)}},s.ParseUrl=function(e){for(var t,r=/[?&]([^=#]+)=([^&#]*)/g,i={};t=r.exec(e);)i[t[1]]=decodeURIComponent(t[2]);return i},s.UpdateParams=function(){var e=this.userParams,t=this.ParseUrl(window.location.href);Object.keys(t).forEach((function(r){e[r]=t[r]}))},s.Select=function(e,t){this.userParams.server?this.target=this.items[parseInt(t)].position:this.channel.trigger("client-move",{index:t})},t}(l)).prototype,"aim",[m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),P=t(g.prototype,"qrcode",[f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),y=t(g.prototype,"items",[d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),v=g))||v));s._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./QRCode.ts","./GameMgr.ts"],(function(){"use strict";return{setters:[null,null],execute:function(){}}}));

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