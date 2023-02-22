/**
 * Check if a number is a power of 2
 * 
 * @param {number} number
 * @return {boolean} True if the given number is a power of 2, false otherwise
 */
export function isPowerOf2 (number) {
    return (number & (number - 1)) === 0
}
