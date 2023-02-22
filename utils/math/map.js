/**
 * Re-map a number from one range to another
 * 
 * @param {number} value      Incoming value to be converted
 * @param {number} currentMin Lower bound of the value's current range
 * @param {number} currentMax Upper bound of the value's current range
 * @param {number} targetMin  Lower bound of the value's target range
 * @param {number} targetMax  Upper bound of the value's target range
 * @return {number} Remapped value
 */
 export function map (value, currentMin, currentMax, targetMin, targetMax) {
    return ((value - currentMin) / (currentMax - currentMin)) * (targetMax - targetMin) + targetMin
}
