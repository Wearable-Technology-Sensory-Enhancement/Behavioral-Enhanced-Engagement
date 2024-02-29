/**
 * File: drawTongueTracker.js
 * Description: Draws the tongue tracker device
 * Author: Tam Le
 * Created on: 02/16/2024
 * 
 * Dependencies: canvasSetup.js to access canvas content
 * Usage: Used by main.js to draw the tongue tracker device onto the canvas
 */

//imports
import { canvas, ctx } from './canvasSetup.js';

//Tongue Tracker Device
export function drawTongueTracker() {
    const squareSize = 450;
    const rectangleWidth = 230;
    const rectangleHeight = 80;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    //Drawing for square
    ctx.beginPath();
    ctx.rect(centerX - squareSize / 2, centerY - squareSize / 2, squareSize, squareSize);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'green';
    ctx.fill();

    //Drawing for rectangle
    ctx.beginPath();
    ctx.rect(centerX - rectangleWidth / 2, centerY - squareSize / 2 - rectangleHeight, rectangleWidth, rectangleHeight);
    ctx.strokeStyle = 'green';
    ctx.stroke();
    ctx.fillStyle = 'green';
    ctx.fill();
}