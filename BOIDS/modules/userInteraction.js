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

export class Paint {
    constructor() {
        this.isPaintEnabled = false;

        document.getElementById('paint').addEventListener('click', () => {
            this.isPaintEnabled = !this.isPaintEnabled;
        });
    }

    getIsPaintEnabled() {
        return this.isPaintEnabled;
    }
}