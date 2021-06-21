System.register("chunks:///_virtual/QRCode.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var o,e,i,r,n,c,a,h,l;return{setters:[function(t){o=t.inheritsLoose,e=t.defineProperty,i=t.assertThisInitialized},function(t){r=t.cclegacy,n=t._decorator,c=t.Graphics,a=t.UITransform,h=t.Color,l=t.Component}],execute:function(){var s;r._RF.push({},"62f9dA4X5tCuJJ+SMkpWGmu","QRCode",void 0);var u=n.ccclass;n.property,t("QRCode",u(s=function(t){function r(){for(var o,r=arguments.length,n=new Array(r),c=0;c<r;c++)n[c]=arguments[c];return o=t.call.apply(t,[this].concat(n))||this,e(i(o),"ctx",void 0),o}o(r,t);var n=r.prototype;return n.onLoad=function(){this.ctx=this.node.getComponent(c)},n.update=function(t){},n.CreateQR=function(t){var o=new window.qrcode(-1,"L");o.addData(t),o.make();var e=this.node.getComponent(a).contentSize;this.ctx.fillColor=h.WHITE,this.ctx.rect(-e.width/2,-e.height/2,e.width,e.height),this.ctx.fill();for(var i=e.width/o.getModuleCount(),r=e.height/o.getModuleCount(),n=0;n<o.getModuleCount();n++)for(var c=0;c<o.getModuleCount();c++)if(o.isDark(n,c)){var l=Math.ceil((c+1)*i)-Math.floor(c*i),s=Math.ceil((n+1)*i)-Math.floor(n*i);this.ctx.fillColor=h.BLACK,this.ctx.rect(Math.round(c*i)-e.width/2,Math.round(n*r)-e.height/2,l,s),this.ctx.fill()}},r}(l))||s);r._RF.pop()}}}));

System.register("chunks:///_virtual/GameMgr.ts",["./_rollupPluginModLoBabelHelpers.js","cc","./QRCode.ts"],(function(e){"use strict";var t,r,i,n,a,o,s,c,l,u,h;return{setters:[function(e){t=e.applyDecoratedDescriptor,r=e.inheritsLoose,i=e.initializerDefineProperty,n=e.assertThisInitialized,a=e.defineProperty},function(e){o=e.cclegacy,s=e._decorator,c=e.Node,l=e.Vec3,u=e.Component},function(e){h=e.QRCode}],execute:function(){var p,m,f,d,g,b,v,y,P;o._RF.push({},"980f3AafxNK36ipk+geXF5p","GameMgr",void 0);var w=s.ccclass,M=s.property;e("GameMgr",(p=w("GameMgr"),m=M(c),f=M(h),d=M([c]),p((v=t((b=function(e){function t(){for(var t,r=arguments.length,o=new Array(r),s=0;s<r;s++)o[s]=arguments[s];return t=e.call.apply(e,[this].concat(o))||this,i(n(t),"aim",v,n(t)),i(n(t),"qrcode",y,n(t)),i(n(t),"items",P,n(t)),a(n(t),"target",void 0),a(n(t),"userParams",{}),a(n(t),"ably",void 0),t}r(t,e);var o=t.prototype;return o.start=function(){var e=this;(this.UpdateParams(),this.ably=new window.Ably.Realtime("4dMEFQ.QSr59Q:M2OFXrdh5He_87bz"),this.ably.connection.on("connected",(function(){console.log("That was simple, you're now connected to Ably in realtime")})),this.userParams.server)&&(this.qrcode.CreateQR("https://laminhtruong.github.io/pusher-demo/index.html"),this.ably.channels.get("gameloft-game").subscribe("move",(function(t){e.target=e.items[parseInt(t.data)].position})));this.qrcode.node.parent.active=this.userParams.server,this.aim.active=this.userParams.server},o.update=function(e){if(null!=this.target){var t=new l(0,0,0);l.lerp(t,this.aim.position,this.target,.1),this.aim.setPosition(t)}},o.ParseUrl=function(e){for(var t,r=/[?&]([^=#]+)=([^&#]*)/g,i={};t=r.exec(e);)i[t[1]]=decodeURIComponent(t[2]);return i},o.UpdateParams=function(){var e=this.userParams,t=this.ParseUrl(window.location.href);Object.keys(t).forEach((function(r){e[r]=t[r]}))},o.Select=function(e,t){this.userParams.server?this.target=this.items[parseInt(t)].position:this.ably.channels.get("gameloft-game").publish("move",t)},t}(u)).prototype,"aim",[m],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),y=t(b.prototype,"qrcode",[f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),P=t(b.prototype,"items",[d],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),g=b))||g));o._RF.pop()}}}));

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