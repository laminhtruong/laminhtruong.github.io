System.register("chunks:///_virtual/GameMgr.ts",["./_rollupPluginModLoBabelHelpers.js","cc","./VideoCamera.ts"],(function(r){"use strict";var e,t,a,o,i,n,l,s,c,u,d,h,m;return{setters:[function(r){e=r.applyDecoratedDescriptor,t=r.inheritsLoose,a=r.asyncToGenerator,o=r.initializerDefineProperty,i=r.assertThisInitialized,n=r.defineProperty},function(r){l=r.cclegacy,s=r._decorator,c=r.Camera,u=r.Node,d=r.Mat4,h=r.Component},function(r){m=r.default}],execute:function(){var p,v,M,f,C,g,w;l._RF.push({},"64116W9IYVC6LO+rO7s9Zh2","GameMgr",void 0);var y=s.ccclass,k=s.property;r("GameMgr",(p=y("GameMgr"),v=k(c),M=k(u),p((g=e((C=function(r){function e(){for(var e,t=arguments.length,a=new Array(t),l=0;l<t;l++)a[l]=arguments[l];return e=r.call.apply(r,[this].concat(a))||this,o(i(e),"camera",g,i(e)),o(i(e),"root",w,i(e)),n(i(e),"arController",void 0),n(i(e),"videoCamera",new m),n(i(e),"video",void 0),n(i(e),"markerMatrix",new Float64Array(12)),n(i(e),"worldMatrix",new Float64Array(16)),e}t(e,r);var l=e.prototype;return l.start=function(){var r=this;this.videoCamera.Setup().then((function(e){var t=new ARCameraParam;t.onload=a(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:r.arController=new ARController(e.videoWidth,e.videoHeight,t),r.arController.setPatternDetectionMode(window.artoolkit.AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX),r.arController.loadMarker("patt.hiro",(function(r){console.log("loaded marker",r)}));case 3:case"end":return a.stop()}}),a)}))),t.load("camera_para.dat"),r.video=e,r.video.play()}))},l.update=function(r){if(this.arController&&this.video)if(this.arController.detectMarker(this.video),this.arController.getMarkerNum()>0){this.root.active?this.arController.getTransMatSquareCont(0,1,this.markerMatrix,this.markerMatrix):this.arController.getTransMatSquare(0,1,this.markerMatrix),this.root.active=!0,this.arController.arglCameraViewRHf(this.arController.transMatToGLMat(this.markerMatrix),this.worldMatrix);var e=new d;d.fromArray(e,this.worldMatrix),this.root.matrix=e}else this.root.active=!1},e}(h)).prototype,"camera",[v],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),w=e(C.prototype,"root",[M],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),f=C))||f));l._RF.pop()}}}));

System.register("chunks:///_virtual/VideoCamera.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(e){"use strict";var t,r;return{setters:[function(e){t=e.asyncToGenerator},function(e){r=e.cclegacy}],execute:function(){r._RF.push({},"9578axkwt9GiKmMk2GWznXK","VideoCamera",void 0);e("default",function(){function e(){}var r=e.prototype;return r.Setup=function(){var e=t(regeneratorRuntime.mark((function e(){var t,r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){e.next=2;break}throw new Error("Browser API navigator.mediaDevices.getUserMedia not available");case 2:return t=document.getElementById("video"),r={audio:!1,video:{}},e.next=6,navigator.mediaDevices.getUserMedia(r);case 6:return n=e.sent,t.srcObject=n,t.setAttribute("webkit-playsinline",""),t.setAttribute("playsinline","playsinline"),t.setAttribute("muted",""),e.abrupt("return",new Promise((function(e,r){t.onloadedmetadata=function(){e(t)}})));case 12:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),r.Init=function(){var e=t(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.Setup();case 2:return(t=e.sent).play(),e.abrupt("return",t);case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),e}());r._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./VideoCamera.ts","./GameMgr.ts"],(function(){"use strict";return{setters:[null,null],execute:function(){}}}));

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