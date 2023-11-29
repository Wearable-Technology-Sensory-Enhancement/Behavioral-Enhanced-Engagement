// BEE.js
const canvas = document.getElementById('beeCanvas');
const ctx = canvas.getContext('2d');

// Function to resize the canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}



// Resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas(); // Call this function on script load to initially size the canvas

class Bee {
    constructor(index, totalBees) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.velocityX = Math.random() * 2 - 1; // Random horizontal velocity
        this.velocityY = Math.random() * 2 - 1; // Random vertical velocity
        this.mode = 'wander';

        const hue = (index / totalBees) * 360; // Spread hues over 360 degrees
        this.color = `hsl(${hue}, 100%, 50%)`; // Full saturation and 50% lightness

        
    }
    

    update() {
        if (this.mode === 'wander') {
            // Wandering behavior
            this.velocityX += Math.random() * 0.2 - 0.1;
            this.velocityY += Math.random() * 0.2 - 0.1;

            // Keep within a certain area
            const centerPoint = { x: canvas.width / 2, y: canvas.height / 2 };
            const maxDistance = 100;
            const distanceFromCenter = Math.sqrt((this.x - centerPoint.x) ** 2 + (this.y - centerPoint.y) ** 2);

            if (distanceFromCenter > maxDistance) {
                this.velocityX -= (this.x - centerPoint.x) * 0.00001;
                this.velocityY -= (this.y - centerPoint.y) * 0.00001;
            }
        } else if (this.mode === 'shape') {
            // Shape forming logic
            // This will be handled in moveToTarget
        }

        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    moveToTarget(target) {
        let targetDirection = { x: target.x - this.x, y: target.y - this.y };
        let distance = Math.sqrt(targetDirection.x ** 2 + targetDirection.y ** 2);
    
        if (distance > 1) { // '1' is the distance threshold for stopping
            // Normalize the direction
            let normalizedDirection = { x: targetDirection.x / distance, y: targetDirection.y / distance };
    
            // Move towards the target
            this.velocityX = normalizedDirection.x * 2; // Adjust the multiplier as needed
            this.velocityY = normalizedDirection.y * 2;
        } else {
            // Stop the bee if it's close enough to the target
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }
    
    
    

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = this.color; // Use the assigned color
        ctx.fill();
    }
}


let bees = [];
const totalBees = 50; // Number of bees

for (let i = 0; i < totalBees; i++) {
    bees.push(new Bee(i, totalBees));
}



let currentShape = 'none';
let shapePoints = [];

document.getElementById('formA').addEventListener('click', () => {
    currentShape = 'A';
    shapePoints = getShapeAPoints(canvas.width / 2, canvas.height / 2, 200, 20);
    bees.forEach(bee => bee.mode = 'shape');
});

document.getElementById('formPathway').addEventListener('click', () => {
    currentShape = 'pathway';
    shapePoints = getPathwayPoints((canvas.width / 2) - 200, (canvas.height / 2) - 100, 5, 5, 20);
    bees.forEach(bee => bee.mode = 'shape');
});

// Add more event listeners for other buttons


function getShapeAPoints(centerX, centerY, size, numPoints) {
    let points = [];

    // Calculate the number of points for the vertical and horizontal parts
    let numPointsVertical = Math.ceil(numPoints * 0.4); // 40% of points for the vertical line
    let numPointsHorizontal = numPoints - numPointsVertical; // Remaining points for the horizontal line

    // Points for the vertical line of 'T'
    let verticalStartY = centerY - size / 2;
    let verticalEndY = centerY + size / 2;
    for (let i = 0; i < numPointsVertical; i++) {
        let x = centerX;
        let y = verticalStartY + (i / (numPointsVertical - 1)) * (verticalEndY - verticalStartY);
        points.push({ x, y });
    }

    // Points for the horizontal line of 'T'
    let horizontalStartX = centerX - size / 2;
    let horizontalEndX = centerX + size / 2;
    for (let i = 0; i < numPointsHorizontal; i++) {
        let x = horizontalStartX + (i / (numPointsHorizontal - 1)) * (horizontalEndX - horizontalStartX);
        let y = centerY - size / 2; // Horizontal line is at the top of the vertical line
        points.push({ x, y });
    }

    return points;
}


function getPathwayPoints(startX, startY, numSegments, segmentLength, turnSpacing) {
    let points = [];
    let currentX = startX;
    let currentY = startY;
    let horizontal = true; // Start with a horizontal segment

    for (let i = 0; i < numSegments; i++) {
        if (horizontal) {
            // Create points for a horizontal segment
            for (let j = 0; j < segmentLength; j++) {
                points.push({ x: currentX + j * turnSpacing, y: currentY });
            }
            // Update currentX for the next segment
            currentX += segmentLength * turnSpacing;
        } else {
            // Create points for a vertical segment
            for (let j = 0; j < segmentLength; j++) {
                points.push({ x: currentX, y: currentY + j * turnSpacing });
            }
            // Update currentY for the next segment
            currentY += segmentLength * turnSpacing;
        }
        // Alternate between horizontal and vertical segments
        horizontal = !horizontal;
    }

    return points;
}


canvas.addEventListener('mousemove', function(event) {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left; // Get the mouse position relative to the canvas
    let mouseY = event.clientY - rect.top;

    bees.forEach(function(bee) {
        let distance = Math.sqrt(Math.pow(bee.x - mouseX, 2) + Math.pow(bee.y - mouseY, 2));
        if (distance < 10) { // "10" is the radius to detect touch, adjust as needed
            bee.mode = 'wander';
        }
    });
});



function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bees.length; i++) {
        let bee = bees[i];
        if (bee.mode === 'shape') {
            bee.moveToTarget(shapePoints[i % shapePoints.length]);
        }
        bee.update();
        bee.draw();
    }
}

animate();

