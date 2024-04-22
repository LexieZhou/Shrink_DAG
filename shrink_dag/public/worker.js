let canvas;
let ctx;

self.onmessage = function(ev) {
  if(ev.data.msg === 'init') {
    // obtain the canvas, context and data from the main thread
    const osc = ev.data.canvas;
    const ctx = osc.getContext('2d');
    const result = ev.data.data;
    console.log('Worker received data:', result);

    // Logic to find border width and border height
    let bw = Object.keys(result[0]).length * 200; // Calculating Border Width
    let bh = (result.length + 1) * 40; // Calculating Border Height
    const p = 10; // Margin for the table
    ctx.clearRect(0, 0, osc.width, osc.height);

    // Drawing rows outline on the table…
    for (let x = 0; x <= bw; x += 200) {
      ctx.moveTo(0.5 + x + p, p);
      ctx.lineTo(0.5 + x + p, bh + p);
    }
    // Drawing column outline on the table…
    for (let x = 0; x <= bh; x += 40) {
      ctx.moveTo(p, 0.5 + x + p);
      ctx.lineTo(bw + p, 0.5 + x + p);
    }
    // Setting properties for the border lines in the table drawn
    ctx.strokeStyle = "black";
    ctx.stroke();

    let keys = Object.keys(result[0]); // finding keys in each JSON object
    // To print the values in the Table Excluding Header
    for (let y = 80, count = 0; y <= bh; y += 40) {
      for (let x = 0, keyCount = 0; x < bw; x += 200) {
        ctx.font = "normal 16px Verdana";
        ctx.fillStyle = "black";
        ctx.fillText(result[count][keys[keyCount]], 0.5 + x + p + 5, y);
        ++keyCount;
      }
      ++count;
    }
    // To Print the Header…
    for (let x = 0, keyCount = 0; x < bw; x += 200) {
      ctx.font = "bold 16px Verdana";
      ctx.fillStyle = "black";
      ctx.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
      ++keyCount;
    }

    // To clear extra rows and table in the column in canvas when table is redrawn or restructured.
    ctx.clearRect(11, bh + 11, ctx.width, ctx.height);
    ctx.clearRect(bw + 11, 9.5, ctx.width, ctx.height);
    ctx.save(); // to save the context into the Stack

    // Send the rendering result back to the main thread
    const btm = osc.transferToImageBitmap();
    self.postMessage({ msg:"render", btm: btm }, [btm]);

  }
}
