import { boundaries } from './tongueTracker.js';
import { canvas } from './canvasSetup.js';

export class CursorInteraction {
    constructor() {
        this.isDown = false;
        this.position = { x: 0, y: 0 };
        this.lastPosition = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };

        canvas.addEventListener('mousedown', (e) => {
            if (this.isInsideDevice(e.clientX, e.clientY)) {
                this.isDown = true;
            }
        });

        canvas.addEventListener('mouseup', () => {
            this.isDown = false;
        });

        canvas.addEventListener('mousemove', (e) => {
            this.updatePosition(e.clientX, e.clientY);
        });
    }

    isInsideDevice(x, y) {
        // Check if the cursor is within the device bounds
        return (
            x >= boundaries.square.left &&
            x <= boundaries.square.right &&
            y >= boundaries.rectangle.top && // Assuming the rectangle is the top part
            y <= boundaries.square.bottom
        );
    }

    updatePosition(x, y) {
        // Update velocity and position
        this.lastPosition = { ...this.position };
        this.position = { x, y };
        this.velocity = {
            x: this.position.x - this.lastPosition.x,
            y: this.position.y - this.lastPosition.y,
        };
    }

    getVelocity() {
        return this.isDown ? this.velocity : { x: 0, y: 0 };
    }
}
