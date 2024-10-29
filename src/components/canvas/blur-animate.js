import React, { useRef, useEffect } from "react";
import 'context-filter-polyfill';

const Canvas = (props) => {
  const canvasRef = useRef(null);
  //
  //const draw = () => {

  //}
  useEffect(() => {
    const image = new Image();
    image.src = "/blur2-3.jpg";

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    image.onload = () => {
      let start = 0
      let raf;
      canvas.width = image.width;
        canvas.height = image.height;
        //ctx.filter = "blur(5px)";
        //ctx.drawImage(image, 0, 0);
        //var imgData = ctx.getImageData(0, 0, image.width, image.height);
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.drawImage(image, -20, -20);
      function draw() {
        console.log("test", start)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "blur(5px)";
        ctx.drawImage(image, 0, 0);
        //ctx.putImageData(imgData, 0, 0);
        ctx.beginPath();
        ctx.moveTo(start + 200, 0);
        ctx.lineTo(start + 300, 0);
        ctx.lineTo(start + 100, image.height);
        ctx.lineTo(start + 0, image.height);
        var pattern = ctx.createPattern(image, "no-repeat");
        ctx.fillStyle = pattern;
        
        ctx.filter = "none";
        ctx.fill();
        start += 10
        raf = window.requestAnimationFrame(draw)
        if (start > 500) {
          window.cancelAnimationFrame(raf)
        }
      }
      
      raf = window.requestAnimationFrame(draw)
    };
  }, []);

  return (
    <>
    <canvas ref={canvasRef} {...props}  />
    </>
  );
};

export default Canvas;
