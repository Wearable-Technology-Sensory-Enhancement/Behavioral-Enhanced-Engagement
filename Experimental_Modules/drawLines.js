import { canvas, ctx } from './canvasSetup.js';

let isDrawing = false;
let lastMousePosition = {x: 0, y: 0};
let currentMousePosition = {x: 0, y:0};
let lastTime = 0;
let lines = [];

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastMousePosition = {x: e.offsetX, y: e.offsetY}
    lastTime = performance.now();
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const currentTime = performance.now();
        const timeElapsed = currentTime - lastTime;
        currentMousePosition = {x: e.offsetX, y: e.offsetY}

        const distance = Math.hypot(currentMousePosition.x - lastMousePosition.x, currentMousePosition.y - lastMousePosition.y);
        const velocity = distance / (timeElapsed / 1000); 
        
        ctx.beginPath();
        ctx.moveTo(lastMousePosition.x, lastMousePosition.y);
        ctx.lineTo(currentMousePosition.x, currentMousePosition.y);
        ctx.stroke();

        // Store line segment with its velocity
        lines.push({
            start: {...lastMousePosition},
            end: {...currentMousePosition},
            velocity // pixels per second
        });

        lastMousePosition = {...currentMousePosition};
        lastTime = currentTime;
    }
});

canvas.addEventListener('mouseup', (e) => {
    isDrawing = false;
});

