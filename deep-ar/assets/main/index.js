System.register("chunks:///_virtual/VideoCamera.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(e){"use strict";var t,i;return{setters:[function(e){t=e.asyncToGenerator},function(e){i=e.cclegacy}],execute:function(){i._RF.push({},"9578axkwt9GiKmMk2GWznXK","VideoCamera",void 0);e("default",function(){function e(){}var i=e.prototype;return i.Setup=function(){var e=t(regeneratorRuntime.mark((function e(){var t,i,n,r=this;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){e.next=2;break}throw new Error("Browser API navigator.mediaDevices.getUserMedia not available");case 2:return t=document.getElementById("video"),i={audio:!1,video:{facingMode:"environment",width:{ideal:640},height:{ideal:480}}},e.next=6,navigator.mediaDevices.getUserMedia(i);case 6:return n=e.sent,t.srcObject=n,t.setAttribute("webkit-playsinline",""),t.setAttribute("playsinline","playsinline"),t.setAttribute("muted",""),t.style.width="640px",t.style.height="480px",e.abrupt("return",new Promise((function(e,i){t.onloadedmetadata=function(){r.Resize(t),e(t)}})));case 14:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),i.Resize=function(e){var t=window.innerWidth,i=window.innerHeight,n=e.videoWidth/e.videoHeight;if(t/i<n){var r=n*i;e.style.width=r+"px",e.style.marginLeft=-(r-t)/2+"px",e.style.height=i+"px",e.style.marginTop="0px"}else{var a=1/(n/t);e.style.height=a+"px",e.style.marginTop=-(a-i)/2+"px",e.style.width=t+"px",e.style.marginLeft="0px"}},e}());i._RF.pop()}}}));

System.register("chunks:///_virtual/GameMgr.ts",["./_rollupPluginModLoBabelHelpers.js","cc","./VideoCamera.ts"],(function(e){"use strict";var n,t,i,a,o,r,c;return{setters:[function(e){n=e.inheritsLoose,t=e.defineProperty,i=e.assertThisInitialized},function(e){a=e.cclegacy,o=e._decorator,r=e.Component},function(e){c=e.default}],execute:function(){var s;a._RF.push({},"d98c6lPlPhIio4tyB45R8+K","GameMgr",void 0);var d=o.ccclass;o.property,e("GameMgr",d("GameMgr")(s=function(e){function a(){for(var n,a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return n=e.call.apply(e,[this].concat(o))||this,t(i(n),"videoCamera",new c),t(i(n),"videoDom",void 0),t(i(n),"deepAR",void 0),n}n(a,e);var o=a.prototype;return o.start=function(){this.DeepARInit()},o.DeepARInit=function(){var e=window.DeepAR({licenseKey:"a35cd2e09c5ae64b0788143059f739cb723eb240e939b3c68877c0bb813495d1e8a8817f1b952a58",canvasWidth:window.innerWidth,canvasHeight:window.innerHeight,canvas:document.getElementById("deepar-canvas"),numberOfFaces:1,onInitialize:function(){e.startVideo(!0),e.switchEffect(0,"slot","./aviators",(function(){}))},onFaceTracked:function(e){}});e.downloadFaceTrackingModel("libs/deepar/models-68-extreme.bin")},a}(r))||s);a._RF.pop()}}}));

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