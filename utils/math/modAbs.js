/**
 * Modulo absolute a value based on a length
 * 
 * @param {number} value
 * @param {number} length
 * @return {number} Modulated value
 */
export function modAbs (value, length) {
    if (value < 0) {
        return length + value % length
    }

    return value % length
}
