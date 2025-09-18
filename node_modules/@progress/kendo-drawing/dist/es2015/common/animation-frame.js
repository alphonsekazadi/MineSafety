let animationFrameProxy = (callback) => {
    const wnd = typeof window !== "undefined" ? window : {};
    const animationFrame = wnd.requestAnimationFrame ||
                        wnd.webkitRequestAnimationFrame ||
                        wnd.mozRequestAnimationFrame ||
                        wnd.oRequestAnimationFrame ||
                        wnd.msRequestAnimationFrame ||
                        function(callback) { setTimeout(callback, 1000 / 60); };

    animationFrameProxy = callback => animationFrame.call(wnd, callback);
    animationFrameProxy(callback);
};

export default animationFrameProxy;
