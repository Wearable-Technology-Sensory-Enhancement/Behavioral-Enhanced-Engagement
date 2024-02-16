/**
 * File: main.js
 * Description: The main file of the boids project. Contains the animations as well as amount of boids.
 * Author: Tam Le
 * Created on: 02/16/2024
 * 
 * Dependencies: canvasSetup.js, boid.js, drawTongueTracker.js, userInteraction.js
 */

import { Boid } from './modules/boid.js';
import { drawTongueTracker } from './modules/tongueTracker.js';
import { canvas, ctx } from './modules/canvasSetup.js';
import { MouseAttraction, Paint } from './modules/userInteraction.js';

//Spawning Boids
let boids = [];

for (let i = 0; i < 100; i++) {
    boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height, `hsl(${Math.random() * 360}, 100%, 50%)`))
}   

//Creating MouseAttraction Instance
const mouseAttraction = new MouseAttraction();

//Creating Paint Instance
const paint = new Paint();

//Animation
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    drawTongueTracker();

    const mousePosition = mouseAttraction.getMousePosition();
    const isPaintingEnabled = paint.getIsPaintEnabled();


    boids.forEach(boid => {
        boid.update(boids, mousePosition, isPaintingEnabled); 
        boid.draw();
    });
}

//Animation Loop
drawTongueTracker();
animate();