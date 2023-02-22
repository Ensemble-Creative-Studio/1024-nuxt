/**
 * Round a number up to a nearest multiple
 * 
 * @param {number} value        Value to round
 * @param {number} [multiple=1] Multiple
 * @return {number} Closest multiple
 */
 export function roundTo (value, multiple = 1) {
    if (multiple === 0) return value
    return Math.round(value / multiple) * multiple
}
