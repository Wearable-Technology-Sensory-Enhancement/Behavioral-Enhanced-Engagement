/**
 * File: canvasSetup.js
 * Description: Sets up the canvas element used across the project to display the boids and the tongue tracker
 * Author: Tam Le
 * Created on: 02/16/2024
 * 
 * Dependencies: None
 * Usage: Used by boid.js, tongueTracker.js, and main.js for the animations of the boids
 */

//Initializing Canvas
export const canvas = document.getElementById('boidsCanvas')
export const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.9