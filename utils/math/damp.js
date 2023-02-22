import { lerp } from './lerp'

/**
 * Smoothly interpolate a number toward another
 * 
 * @param {number} a    Number to interpolate
 * @param {number} b    Destination of the interpolation
 * @param {number} ease A higher value will make the movement more sudden, and a lower value will make the movement more gradual
 * @param {number} dt   Delta time
 * @return {number} Interpolated number
 */
export function damp (a, b, ease, dt) {
    return lerp(a, b, 1 - Math.exp(-ease * dt))
}
