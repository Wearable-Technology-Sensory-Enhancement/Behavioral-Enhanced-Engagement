import { canvas } from './canvasSetup.js';

export class MouseAttraction {
    constructor() {
        this.isAttractedToMouse = false;
        this.mousePosition = {x: 0, y: 0};
        
        document.getElementById('toggle-attraction').addEventListener('click', () => {
            this.isAttractedToMouse = !this.isAttractedToMouse;
        });

        canvas.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
    }

    getMousePosition() {
        return this.isAttractedToMouse ? this.mousePosition : null;
    }
}

export class DrawLine {
    constructor() {
        this.isDrawing = false;
        this.linePoints = [];
        this.enableDrawing = false;

        document.getElementById('draw-line').addEventListener('click', ()=> {
            this.enableDrawing = !this.enableDrawing;
            this.linePoints = [];

            if(!this.enableDrawing) {
                this.finishDrawing();
            }
        });

        canvas.addEventListener('mousedown', (e) => {
            if (!this.enableDrawing) return;
            this.isDrawing = true;
            this.linePoints.push({ x: e.clientX, y: e.clientY });
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!this.enableDrawing || !this.isDrawing) return;
            this.linePoints.push({ x: e.clientX, y: e.clientY });
            this.drawPoint(e.clientX, e.clientY);
        });

        canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });
    }

    drawPoint(x, y) {
        ctx.fillStyle = 'black'; 
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2); // Draw small circle to represent the line point
        ctx.fill();
    }

    finishDrawing() {
        //TODO: Implement Logic for boids to follow
    }

    getLinePoints() {
        return this.enableDrawing ? this.linePoints : [];
    }

    //Since the canvas is clearing every frame, we need to make sure the line stays
    redrawLine() {
        if (this.linePoints.length > 0) {
            ctx.beginPath();
            ctx.moveTo(this.linePoints[0].x, this.linePoints[0].y);
            for (let i = 1; i < this.linePoints.length; i++) {
                ctx.lineTo(this.linePoints[i].x, this.linePoints[i].y);
            }
            ctx.strokeStyle = 'black'; // Or any color of your choice
            ctx.lineWidth = 2; // Or any thickness you prefer
            ctx.stroke();
        }
    }
    

}