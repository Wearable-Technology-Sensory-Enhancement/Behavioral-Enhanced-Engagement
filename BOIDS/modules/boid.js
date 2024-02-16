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
 * Dependencies: canvasSetup.js to access canvas content
 * Usage: Used by main.js for the main animation loop
 */

//Imports
import { canvas, ctx } from './canvasSetup.js';

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

    update(boids, mousePosition, isPaintingEnabled) {
        this.alignment(boids);
        this.cohesion(boids);
        this.separation(boids);

        if (mousePosition) {
            this.attract(mousePosition);
        }

        if (isPaintingEnabled && this.isOverTongueTracker()) {
            this.paint(); 
        }

        this.limitVelocity();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //Boundaries
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.y > canvas.height) this.position.y = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
    }

    //Boid Behaviors

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

    //For mouse attraction
    attract(targetPosition) {
        const distance = Math.hypot(targetPosition.x - this.position.x, targetPosition.y - this.position.y);
        if (!targetPosition || distance < 10) return; // Ignore if too close or no targetPosition
    
        // Adjust the strength of the attraction based on the distance
        const attractStrength = Math.min(0.5, 1000 / Math.pow(distance, 2));
    
        // Calculate the direction vector from the boid to the mouse
        const directionToMouse = {
            x: (targetPosition.x - this.position.x) / distance,
            y: (targetPosition.y - this.position.y) / distance,
        };
    
        // Apply a gentle pull towards the mouse
        this.velocity.x += directionToMouse.x * attractStrength;
        this.velocity.y += directionToMouse.y * attractStrength;
    }

    isOverTongueTracker() {
        const trackerBounds = { x: centerX - squareSize / 2, y: centerY - squareSize / 2, width: squareSize, height: squareSize };
        return this.position.x >= trackerBounds.x && this.position.x <= trackerBounds.x + trackerBounds.width &&
               this.position.y >= trackerBounds.y && this.position.y <= trackerBounds.y + trackerBounds.height;
    }

    paint() {
        // Add the current position and color to the paintMarks array
        paintMarks.push({ x: this.position.x, y: this.position.y, color: this.color });
    }

    // Add a method to limit the velocity
    limitVelocity() {
        const maxSpeed = 2.5; // Maximum speed
        const speed = Math.hypot(this.velocity.x, this.velocity.y);
        if (speed > maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * maxSpeed;
        }
    }
}
