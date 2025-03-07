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

// Change the orbits of the boids
document.addEventListener('keypress', function(event) {
    const key = event.key;
    let newOrbitDistance;
    switch (key) {
        case '1':
            newOrbitDistance = 15;  // Distance for key '1'
            break;
        case '2':
            newOrbitDistance = 25;  // Distance for key '2'
            break;
        case '3':
            newOrbitDistance = 60;  // Distance for key '3'
            break;
        case '4':
            newOrbitDistance = 80;
            break;
        default:
            return;  // Ignore other keys
    }
    boids.forEach(boid => {
        boid.orbitDistance = newOrbitDistance;
    });
});


// These Functions are for the speed bar

let displayedSpeed = 0;  // This holds the currently displayed speed for the bar
const smoothingFactor = 0.1;  // Controls the rate of change of the speed bar


function calculateAverageSpeed(boids) {
    let totalSpeed = 0;
    boids.forEach(boid => {
        const speed = Math.sqrt(boid.velocity.x ** 2 + boid.velocity.y ** 2);
        totalSpeed += speed;
    });
    return totalSpeed / boids.length;
}

function drawSpeedBar(averageSpeed) {
    const maxSpeed = 7;  // Maximum speed that fully fills the bar
    // Interpolate the displayed speed towards the average speed
    displayedSpeed += (averageSpeed - displayedSpeed) * smoothingFactor;

    const barWidth = (displayedSpeed / maxSpeed) * canvas.width;  // Calculate bar width
    const barHeight = 5;  // Height of the speed bar
    const yPosition = canvas.height - barHeight - 5;  // Position bar at the bottom, with some padding from the edge

    ctx.fillStyle = 'red';  // Color of the speed bar
    ctx.fillRect(0, yPosition, barWidth, barHeight);
}




//Animation
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    drawTongueTracker();

    // Retrieve the current cursor state and velocity from cursorInteraction
    const isMouseDown = cursorInteraction.isDown;
    const cursorVelocity = cursorInteraction.getVelocity();
    const cursorPosition = cursorInteraction.getPosition();

    boids.forEach(boid => {
        boid.update(isMouseDown, cursorPosition, cursorVelocity);
        boid.draw();
    });

    // Calculate average speed and draw the speed bar
    const averageSpeed = calculateAverageSpeed(boids);
    drawSpeedBar(averageSpeed);
}

//Animation Loop
drawTongueTracker();
animate();