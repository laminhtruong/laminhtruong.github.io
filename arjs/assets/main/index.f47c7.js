System.register("chunks:///_virtual/GameMgr.ts",["./_rollupPluginModLoBabelHelpers.js","cc","./VideoCamera.ts"],(function(r){"use strict";var t,e,a,o,i,n,l,s,c,u,d,h,m;return{setters:[function(r){t=r.applyDecoratedDescriptor,e=r.inheritsLoose,a=r.asyncToGenerator,o=r.initializerDefineProperty,i=r.assertThisInitialized,n=r.defineProperty},function(r){l=r.cclegacy,s=r._decorator,c=r.Camera,u=r.Node,d=r.Mat4,h=r.Component},function(r){m=r.default}],execute:function(){var p,v,f,M,C,g,w;l._RF.push({},"64116W9IYVC6LO+rO7s9Zh2","GameMgr",void 0);var y=s.ccclass,k=s.property;r("GameMgr",(p=y("GameMgr"),v=k(c),f=k(u),p((g=t((C=function(r){function t(){for(var t,e=arguments.length,a=new Array(e),l=0;l<e;l++)a[l]=arguments[l];return t=r.call.apply(r,[this].concat(a))||this,o(i(t),"camera",g,i(t)),o(i(t),"root",w,i(t)),n(i(t),"arController",void 0),n(i(t),"videoCamera",new m),n(i(t),"video",void 0),n(i(t),"markerMatrix",new Float64Array(12)),n(i(t),"worldMatrix",new Float64Array(16)),t}e(t,r);var l=t.prototype;return l.start=function(){var r=this;this.videoCamera.Setup().then((function(t){var e=new ARCameraParam;e.onload=a(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:r.arController=new ARController(t.videoWidth,t.videoHeight,e),r.arController.setPatternDetectionMode(window.artoolkit.AR_TEMPLATE_MATCHING_COLOR),r.arController.loadMarker("test.patt",(function(r){console.log("loaded marker",r)}));case 3:case"end":return a.stop()}}),a)}))),e.load("camera_para.dat"),r.video=t,r.video.play()}))},l.update=function(r){if(this.arController&&this.video)if(this.arController.detectMarker(this.video),this.arController.getMarkerNum()>0){this.root.active?this.arController.getTransMatSquareCont(0,1,this.markerMatrix,this.markerMatrix):this.arController.getTransMatSquare(0,1,this.markerMatrix),this.root.active=!0,this.arController.arglCameraViewRHf(this.arController.transMatToGLMat(this.markerMatrix),this.worldMatrix);var t=new d;d.fromArray(t,this.worldMatrix),this.root.matrix=t}else this.root.active=!1},t}(h)).prototype,"camera",[v],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),w=t(C.prototype,"root",[f],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),M=C))||M));l._RF.pop()}}}));

System.register("chunks:///_virtual/VideoCamera.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(e){"use strict";var t,r;return{setters:[function(e){t=e.asyncToGenerator},function(e){r=e.cclegacy}],execute:function(){r._RF.push({},"9578axkwt9GiKmMk2GWznXK","VideoCamera",void 0);e("default",function(){function e(){}var r=e.prototype;return r.Setup=function(){var e=t(regeneratorRuntime.mark((function e(){var t,r,n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){e.next=2;break}throw new Error("Browser API navigator.mediaDevices.getUserMedia not available");case 2:return t=document.getElementById("video"),r={audio:!1,video:{facingMode:"user"}},e.next=6,navigator.mediaDevices.getUserMedia(r);case 6:return n=e.sent,t.srcObject=n,t.setAttribute("webkit-playsinline",""),t.setAttribute("playsinline","playsinline"),t.setAttribute("muted",""),e.abrupt("return",new Promise((function(e,r){t.onloadedmetadata=function(){e(t)}})));case 12:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),r.Init=function(){var e=t(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.Setup();case 2:return(t=e.sent).play(),e.abrupt("return",t);case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}(),e}());r._RF.pop()}}}));

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