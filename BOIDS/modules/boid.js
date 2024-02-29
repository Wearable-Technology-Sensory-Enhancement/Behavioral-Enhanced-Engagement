/**
 * File: boid.js
 * Description: Defines the Boid class. The Boid class defines unique qualities for each boid, which are position, velocity, and color.
 * The Boid class also contains the 3 behaviors that each boid follows, which are alignment, cohesion, and seperation.
 * Alignment: Boids try to match velocity with nearby boids
 * Cohesion: Boids try to match the center/average position of nearby boids, creating flocks
 * Seperation: Boids avoid getting to close with each other, preventing overcrowding
 * Code Inspiration from: https://people.ece.cornell.edu/land/courses/ece4760/labs/s2021/Boids/Boids.html#:~:text=Boids%20is%20an%20artificial%20life,very%20simple%20set%20of%20rules.
 * Author: Tam Le
 * Created on: 02/16/2024
 * 
 * Dependencies: canvasSetup.js to access canvas content, bounadries from tongueTracker.js for the device boundaries
 * Usage: Used by main.js for the main animation loop
 */

//Imports
import { canvas, ctx } from './canvasSetup.js';
import { boundaries } from './tongueTracker.js';
// import {  } from './interaction.js'

//Boids
export class Boid {
    constructor(x, y, color) {
        this.position = {x: x, y: y};
        this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1};
        this.color = color;
    }

    //Draws the individual boid
    draw() {
        ctx.fillStyle = this.color;
    
        // Calculate the angle of rotation based on the velocity vector
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
    
        ctx.beginPath();
    
        // Move to the tip/front of the triangle
        // The front of the triangle is a point in the direction of the velocity, offset by a certain length
        ctx.moveTo(this.position.x + Math.cos(angle) * 10, this.position.y + Math.sin(angle) * 10);
    
        // Draw line to the bottom left of the triangle
        ctx.lineTo(this.position.x - Math.cos(angle - Math.PI / 6) * 10, this.position.y - Math.sin(angle - Math.PI / 6) * 10);
    
        // Draw line to the bottom right of the triangle
        ctx.lineTo(this.position.x - Math.cos(angle + Math.PI / 6) * 10, this.position.y - Math.sin(angle + Math.PI / 6) * 10);
    
        // Connects back to the tip/front of the triangle
        ctx.closePath(); // Closes the path so the last line is drawn back to the starting point
    
        ctx.fill();
    }

    update(isMouseDown, cursorVelocity) {
        //Commenting these out since we are working on new feature
        // this.alignment(boids);
        // this.cohesion(boids);
        // this.separation(boids);

        if (isMouseDown) {
            this.mimicCursor(cursorVelocity);
        } else {
            this.wander();
        }

        this.limitVelocity();
        this.checkBounds();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    //Boids stay inside the tongue device
    checkBounds() {
        // Boundaries of the tongue tracker
        if (this.position.y < boundaries.rectangle.bottom) {
            if (this.position.x < boundaries.rectangle.left) {
                this.position.x = boundaries.rectangle.left; // Use rectangle's left boundary
                this.velocity.x *= -1;
            } else if (this.position.x > boundaries.rectangle.right) {
                this.position.x = boundaries.rectangle.right; // Use rectangle's right boundary
                this.velocity.x *= -1;
            }
        } else {
            if (this.position.x < boundaries.square.left) {
                this.position.x = boundaries.square.left;
                this.velocity.x *= -1;
            } else if (this.position.x > boundaries.square.right) {
                this.position.x = boundaries.square.right;
                this.velocity.x *= -1;
            }
        }
    
        if (this.position.y < boundaries.rectangle.top) {
            this.position.y = boundaries.rectangle.top;
            this.velocity.y *= -1;
        } else if (this.position.y > boundaries.square.bottom) {
            this.position.y = boundaries.square.bottom;
            this.velocity.y *= -1;
        }
    }
    

    //Boid Behaviors
    wander() {
        const wanderStrength = 0.1;
        this.velocity.x += (Math.random() - 0.5) * wanderStrength;
        this.velocity.y += (Math.random() - 0.5) * wanderStrength;
    }

    mimicCursor(cursorVelocity) {
        // Check if the cursor is moving significantly
        const cursorSpeed = Math.hypot(cursorVelocity.x, cursorVelocity.y);
        const minSpeedThreshold = 0.1; // Define a threshold for what you consider "significant movement"
    
        if (cursorSpeed > minSpeedThreshold) {
            // If the cursor is moving, adjust the boid's velocity to match the cursor's
            this.velocity.x = cursorVelocity.x;
            this.velocity.y = cursorVelocity.y;
        } else {
            // If the cursor is still or moving slowly, orbit around the cursor's position
            this.orbit(cursorVelocity);
        }
    }

    //TODO: Needs more work
    orbit(cursorVelocity) {
        // This is a simple orbital movement that doesn't depend on the cursor's position
        // For actual orbiting around the cursor, additional calculations are needed
    
        // Increase or decrease these to adjust the radius and speed of orbiting
        const radius = 20;
        const orbitSpeed = 0.05;
    
        // Calculate a simple circular orbit
        this.velocity.x = Math.cos(this.angle) * orbitSpeed;
        this.velocity.y = Math.sin(this.angle) * orbitSpeed;
    
        // Update the angle for the next frame
        this.angle += orbitSpeed;
    
        // This is just a basic implementation. To orbit around the cursor,
        // you would adjust the boid's position relative to the cursor's position
    }
    
    
    
    //Boids try to match their velocity with nearby boids
    alignment(boids) {
        let perceptionRadius = 50;
        let steering = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = Math.hypot(other.position.x - this.position.x, other.position.y - this.position.y);
            if (other !== this && d < perceptionRadius) {
                steering.x += other.velocity.x;
                steering.y += other.velocity.y;
                total++;
            }
        }
        if (total > 0) {
            steering.x /= total;
            steering.y /= total;
            // Simple form of steering towards the average - limit forced applied if neccessary
            this.velocity.x += steering.x - this.velocity.x;
            this.velocity.y += steering.y - this.velocity.y;
        }
    }

    //Boids move towards the average position of nearby boids, creating unified groups
    cohesion(boids) {
        let perceptionRadius = 50;
        let centerMass = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = Math.hypot(other.position.x - this.position.x, other.position.y - this.position.y);
            if (other !== this && d < perceptionRadius) {
                centerMass.x += other.position.x;
                centerMass.y += other.position.y;
                total++;
            }
        }
        if (total > 0) {
            centerMass.x /= total;
            centerMass.y /= total;
            // Move towards the center mass - simple form, limit forced applied as neccessary
            this.velocity.x += (centerMass.x - this.position.x) / 100; // Adjust this divisor as needed
            this.velocity.y += (centerMass.y - this.position.y) / 100; // Adjust this divisor as needed
        }
    }

    //Boids avoid getting too close to each other, preventing crowding
    separation(boids) {
        let perceptionRadius = 25;
        let avoidance = { x: 0, y: 0 };
        let total = 0;
        for (let other of boids) {
            let d = Math.hypot(other.position.x - this.position.x, other.position.y - this.position.y);
            if (other !== this && d < perceptionRadius) {
                avoidance.x += (this.position.x - other.position.x) / d;
                avoidance.y += (this.position.y - other.position.y) / d;
                total++;
            }
        }
        if (total > 0) {
            avoidance.x /= total;
            avoidance.y /= total;
            // Apply the avoidance - simple, limit forced applied as neccessary
            this.velocity.x += avoidance.x;
            this.velocity.y += avoidance.y;
        }
    }

    // Add a method to limit the velocity
    limitVelocity() {
        const maxSpeed = 3.5; // Maximum speed
        const speed = Math.hypot(this.velocity.x, this.velocity.y);
        if (speed > maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * maxSpeed;
        }
    }
}
