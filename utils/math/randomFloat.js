/**
 * Generate a random float
 * 
 * @param  {number} min       Minimum boundary
 * @param  {number} max       Maximum boundary
 * @param  {number} precision Precision
 * @return {number} Generated float
 */
export function randomFloat (min, max, precision = 2) {
    return parseFloat(Math.min(min + (Math.random() * (max - min)), max).toFixed(precision))
}
