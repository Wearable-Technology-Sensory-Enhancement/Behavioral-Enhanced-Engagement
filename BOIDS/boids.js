//Initializing Canvas
const canvas = document.getElementById('boidsCanvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.9

//Boids
class Boid {
    constructor(x, y, color) {
        this.position = {x: x, y: y};
        this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1};
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2)
        ctx.fill()
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //Boundaries
        if (this.position.x > canvas.width) this.position.x = 0;
        if (this.position.x < 0) this.position.x = canvas.width;
        if (this.position.y > canvas.height) this.position.y = 0;
        if (this.position.y < 0) this.position.y = canvas.height;
    }
}

//Spawning Boids
let boids = [];

for (let i = 0; i < 100; i++) {
    boids.push(new Boid(Math.random() * canvas.width, Math.random() * canvas.height, `hsl(${Math.random() * 360}, 100%, 50%)`))
}


//Animation
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    boids.forEach(boid => {
        boid.update();
        boid.draw();
    });
}
animate();