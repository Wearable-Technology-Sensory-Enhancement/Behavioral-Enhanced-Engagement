const canvas = document.getElementById('boidsCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas resolution for high DPI displays
const ratio = window.devicePixelRatio || 1;
canvas.width = canvas.offsetWidth * ratio;
canvas.height = canvas.offsetHeight * ratio;
ctx.scale(ratio, ratio);

const maxSpeed = 2; // Boid max speed, Adjust as needed

let mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

let attractToMouse = false;



class Boid {
    constructor(x, y, color) {
        this.position = { x: x, y: y }; // Position of the boid
        this.velocity = { x: Math.random() - 0.5, y: Math.random() - 0.5 }; // Velocity for movement
        this.color = color; // Color of the boid
    }

    // Method to draw the boid on the canvas
    draw(ctx) {
        const angle = Math.atan2(this.velocity.y, this.velocity.x); // Get the angle of movement

        ctx.beginPath();
        // The points make up the triangle, we start at the front of the boid
        ctx.moveTo(this.position.x + 5 * Math.cos(angle), this.position.y + 5 * Math.sin(angle));
        // Then draw lines to the other two points creating a triangle
        ctx.lineTo(this.position.x - 5 * Math.cos(angle - Math.PI / 6), this.position.y - 5 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(this.position.x - 5 * Math.cos(angle + Math.PI / 6), this.position.y - 5 * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(this.position.x + 5 * Math.cos(angle), this.position.y + 5 * Math.sin(angle));

        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    //Speed Limit
    limitVelocity() {
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * maxSpeed;
        }
    }
    

    // Method to update the boid's position and behavior
    update() {
        this.align(boids, 50); // Perception radius can be adjusted
        this.cohesion(boids, 50);
        this.separation(boids, 50);

        if (attractToMouse) {
            this.moveToMouse(mouse);
        }


        this.limitVelocity(); // Limit the velocity to maxSpeed

    
        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    
        // Boundary conditions to keep boids within the canvas
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.y > canvas.height) this.position.y = 0;
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.y < 0) this.position.y = canvas.height;
    }

    //Behaviors
    align(boids, perceptionRadius) {
        let total = 0;
        let averageVelocity = { x: 0, y: 0 };
    
        for (let other of boids) {
            let distance = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
            if (other !== this && distance < perceptionRadius) {
                averageVelocity.x += other.velocity.x;
                averageVelocity.y += other.velocity.y;
                total++;
            }
        }
    
        if (total > 0) {
            averageVelocity.x /= total;
            averageVelocity.y /= total;

            // Alignment Strength Control
            this.velocity.x += averageVelocity.x * 0.1;
            this.velocity.y += averageVelocity.y * 0.1;
        }
    }
    
    cohesion(boids, perceptionRadius) {
        let total = 0;
        let centerOfMass = { x: 0, y: 0 };
    
        for (let other of boids) {
            let distance = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
            if (other !== this && distance < perceptionRadius) {
                centerOfMass.x += other.position.x;
                centerOfMass.y += other.position.y;
                total++;
            }
        }
    
        if (total > 0) {
            centerOfMass.x /= total;
            centerOfMass.y /= total;
            // Move towards the center of mass
            centerOfMass.x -= this.position.x;
            centerOfMass.y -= this.position.y;

            // Cohension Strength Control
            this.velocity.x += centerOfMass.x * 0.01;
            this.velocity.y += centerOfMass.y * 0.01;
        }
    }
    
    separation(boids, perceptionRadius) {
        let total = 0;
        let avoid = { x: 0, y: 0 };
    
        for (let other of boids) {
            let distance = Math.hypot(this.position.x - other.position.x, this.position.y - other.position.y);
            if (other !== this && distance < perceptionRadius) {
                avoid.x += this.position.x - other.position.x;
                avoid.y += this.position.y - other.position.y;
                total++;
            }
        }
    
        if (total > 0) {
            avoid.x /= total;
            avoid.y /= total;

            // Seperation Strength Control
            this.velocity.x += avoid.x * 0.02;
            this.velocity.y += avoid.y * 0.02;
        }
    }


    //Mouse move
    moveToMouse(mouse) {
        const attraction = { x: mouse.x - this.position.x, y: mouse.y - this.position.y };
        this.velocity.x += attraction.x * 0.01; // Adjust factor as needed
        this.velocity.y += attraction.y * 0.01;
    }
    
}

const boids = [];
const numberOfBoids = 100; // Population

for (let i = 0; i < numberOfBoids; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color for each boid
    boids.push(new Boid(x, y, color));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let boid of boids) {
        boid.update();
        boid.draw(ctx);
    }

    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});


document.getElementById('toggleAttraction').addEventListener('click', () => {
    attractToMouse = !attractToMouse;
});



animate(); // Start the animation loop
