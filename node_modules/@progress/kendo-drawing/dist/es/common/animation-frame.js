var animationFrameProxy = function (callback) {
    var wnd = typeof window !== "undefined" ? window : {};
    var animationFrame = wnd.requestAnimationFrame ||
                        wnd.webkitRequestAnimationFrame ||
                        wnd.mozRequestAnimationFrame ||
                        wnd.oRequestAnimationFrame ||
                        wnd.msRequestAnimationFrame ||
                        function(callback) { setTimeout(callback, 1000 / 60); };

    animationFrameProxy = function (callback) { return animationFrame.call(wnd, callback); };
    animationFrameProxy(callback);
};

export default animationFrameProxy;
