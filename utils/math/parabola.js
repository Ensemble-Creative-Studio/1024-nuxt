/**
 * Re-map the 0..1 interval into 0..1 parabola, such that corners are remaped to 0 and the center to 1
 * In other words, parabola(0) = parabola(1) = 0, and parabola(1/2) = 1
 * 
 * @param {number} value Normalized value to map
 * @param {number} x     Normalized coordinate on X axis
 * @return {number} Normalized mapped value
 */
export function parabola (value, x) {
    return Math.pow(4 * x * (1 - x), value)
}
