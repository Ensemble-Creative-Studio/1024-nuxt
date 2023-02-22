import { clamp } from './clamp'
import { normalize } from './normalize'

/**
 * Smooth a value using cubic Hermite interpolation
 * 
 * @param {number} value Value to smooth
 * @param {number} min   Minimum boundary
 * @param {number} max   Maximum boundary
 * @return {number} Normalized smoothed value
 */
export function smoothstep (value, min, max) {
    const x = clamp(normalize(value, min, max))
    return x * x * (3 - 2 * x)
}
