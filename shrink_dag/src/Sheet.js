import React, { useEffect, useState } from 'react';
// Data from: https://microsoftedge.github.io/Demos/json-dummy-data/
import sheetData from './data/output.json';
import './Sheet.css';

function Sheet() {

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    // create a new canvas element
    const htmlcanvas = document.createElement('canvas');
    htmlcanvas.width = 1200;
    htmlcanvas.height = 16000;
    canvas.appendChild(htmlcanvas);

    // transfer the control of the canvas to the offscreen
    const offscreen = htmlcanvas.transferControlToOffscreen();

    // create a new worker
    const worker = new Worker('worker.js');
    // listen for messages from the worker
    worker.onmessage = function (e) {
      console.log('Message received from worker: ', e.data);
      if (e.data.msg !== 'render') return;
      // transfer the image bitmap to the canvas
      const btm = e.data.btm;
      const ctx = canvas.getContext("bitmaprenderer");
      ctx.transferFromImageBitmap(btm);
    }
    // post a message, sheet data and offscreencanvas to the worker
    worker.postMessage({ msg: 'init', data: sheetData, canvas: offscreen}, [offscreen]);

    return () => {
      worker.terminate();
    }
  }, []);

  return (
    <div id="table-container">
      <canvas width="1200" height="16000"></canvas>
    </div>
  );
}

export default Sheet;