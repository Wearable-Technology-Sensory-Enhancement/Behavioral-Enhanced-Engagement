/**
 * File: main.js
 * Description: The main file of the boids project. Contains the animations as well as amount of boids.
 * Author: Tam Le
 * Created on: 02/16/2024
 * 
 * Dependencies: canvasSetup.js, boid.js, and drawTongueTracker.js, interaction.js
 */

import { Boid } from './modules/boid.js';
import { drawTongueTracker } from './modules/tongueTracker.js';
import { canvas, ctx } from './modules/canvasSetup.js';
import { CursorInteraction } from './modules/interaction.js';

//Spawning Boids
let boids = [];

for (let i = 0; i <= 5; i++) {
    boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height, `hsl(${Math.random() * 360}, 100%, 50%)`))
}   

const cursorInteraction = new CursorInteraction();

//Animation
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    drawTongueTracker();

    // Retrieve the current cursor state and velocity from cursorInteraction
    const isMouseDown = cursorInteraction.isDown;
    const cursorVelocity = cursorInteraction.getVelocity();

    boids.forEach(boid => {
        boid.update(isMouseDown, cursorVelocity);
        boid.draw();
    });
}

//Animation Loop
drawTongueTracker();
animate();