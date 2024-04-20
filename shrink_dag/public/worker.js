
let canvas;
let ctx;

self.onmessage = function(ev) {
  if(ev.data.msg === 'init') {
    const osc = new OffscreenCanvas(400, 400);
    const ctx = osc.getContext('2d');

    ctx.font = "bold 16px Verdana";
    ctx.fillText("Hello World", 10, 50);
    const btm = osc.transferToImageBitmap();
    self.postMessage({ msg:"render", btm: btm }, [btm]);
  }
}
