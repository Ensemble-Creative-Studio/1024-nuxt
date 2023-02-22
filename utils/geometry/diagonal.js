/**
 * Calculate the length of the diagonal of a rectangle
 * 
 * @param {number} width  Width of the rectangle
 * @param {number} height Height of the rectangle
 * @return {number} Diagonal length
 */
export function diagonal (width, height) {
    return Math.sqrt(width * width + height * height)
}
