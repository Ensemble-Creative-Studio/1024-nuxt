/**
 * Clamp a value between two bounds
 * 
 * @param {number} value   Value to clamp
 * @param {number} [min=0] Minimum boundary
 * @param {number} [max=1] Maximum boundary
 * @return {number} Clamped value
 */
export function clamp (value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value))
}
