import React, { useEffect, useState } from 'react';
import sheetData from './data/5MB.json';
import useWebWorker from './worker';

function Sheet() {
  function workerFunction() {
    this.onmessage = function(e) {
      this.postMessage(e.data)
    };
  }
  const { result, error, loading } = useWebWorker(workerFunction, sheetData);

  useEffect(() => {
    if (loading) console.log("Loading...");
    if (error) console.error("Error:", error);
    if (!result) {
      console.log('No sheet data');
      return;
    } else {
      console.log('Sheet data:', result);
    }
    const canvas = document.getElementById("canvasTable");
    const context = canvas.getContext("2d");

    // Logic to find border width and border height
    let bw = Object.keys(result[0]).length * 200; // Calculating Border Width
    let bh = (result.length + 1) * 40; // Calculating Border Height

    const p = 10; // Margin
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Drawing rows outline on the table…
    for (let x = 0; x <= bw; x += 200) {
      context.moveTo(0.5 + x + p, p);
      context.lineTo(0.5 + x + p, bh + p);
    }

    // Drawing column outline on the table…
    for (let x = 0; x <= bh; x += 40) {
      context.moveTo(p, 0.5 + x + p);
      context.lineTo(bw + p, 0.5 + x + p);
    }

    // Setting properties for the border lines in the table drawn
    context.strokeStyle = "black";
    context.stroke();

    let keys = Object.keys(result[0]); // finding keys in each JSON object

    // To print the values in the Table Excluding Header
    for (let y = 80, count = 0; y <= bh; y += 40) {
      for (let x = 0, keyCount = 0; x < bw; x += 200) {
        context.font = "normal 16px Verdana";
        context.fillStyle = "black";
        context.fillText(result[count][keys[keyCount]], 0.5 + x + p + 5, y);
        ++keyCount;
      }
      ++count;
    }

    // To Print the Header…
    for (let x = 0, keyCount = 0; x < bw; x += 200) {
      context.font = "bold 16px Verdana";
      context.fillStyle = "black";
      context.fillText(keys[keyCount], 0.5 + x + p + 5, p + 25);
      ++keyCount;
    }

    // To clear extra rows and table in the column in canvas when table is redrawn or restructured.
    context.clearRect(11, bh + 11, canvas.width, canvas.height);
    context.clearRect(bw + 11, 9.5, canvas.width, canvas.height);
    context.save(); // to save the context into the Stack
  }, [loading, error, result]);

  return (
    <div>
      <canvas
        id="canvasTable"
        width="2200"
        height="1800"
        style={{
          position: 'absolute',
          top: '50px',
          left: '50px',
          zIndex: 2,
          width: '1428px',
          height: '761px',
          paddingTop: '0px',
          paddingLeft: '0px'
        }}
      >
        Your Browser does not support Canvas.
      </canvas>
    </div>
  );
}

export default Sheet;