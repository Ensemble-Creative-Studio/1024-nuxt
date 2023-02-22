/**
 * Linear interpolation between two values (lerping)
 * 
 * @param {number} value Normalized value to interpolate
 * @param {number} min   Minimum value
 * @param {number} max   Maximum value
 * @return {number} Lerped value
 */
export function lerp (value, min, max) {
    return min + ((max - min) * value)
}
