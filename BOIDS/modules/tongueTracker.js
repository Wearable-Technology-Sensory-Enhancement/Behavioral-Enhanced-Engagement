/**
 * File: drawTongueTracker.js
 * Description: Draws the tongue tracker device
 * Author: Tam Le
 * Created on: 02/16/2024
 * 
 * Dependencies: canvasSetup.js to access canvas content
 * Usage: Used by main.js to draw the tongue tracker device onto the canvas
 */

import { canvas, ctx } from './canvasSetup.js';

// Device dimensions and position
const squareSize = 450;
const rectangleWidth = 230;
const rectangleHeight = 80;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Calculated boundary positions
export const boundaries = {
    square: {
        left: centerX - squareSize / 2,
        right: centerX + squareSize / 2,
        top: centerY - squareSize / 2,
        bottom: centerY + squareSize / 2,
    },
    rectangle: {
        left: centerX - rectangleWidth / 2,
        right: centerX + rectangleWidth / 2,
        top: centerY - squareSize / 2 - rectangleHeight,
        bottom: centerY - squareSize / 2,
    },
};

// Function to draw the tracker
export function drawTongueTracker() {
    // Square
    ctx.beginPath();
    ctx.rect(boundaries.square.left, boundaries.square.top, squareSize, squareSize);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'green';
    ctx.fill();

    // Rectangle
    ctx.beginPath();
    ctx.rect(boundaries.rectangle.left, boundaries.rectangle.top, rectangleWidth, rectangleHeight);
    ctx.strokeStyle = 'green';
    ctx.stroke();
    ctx.fillStyle = 'green';
    ctx.fill();
}
