/**
 * Generate an unique string ID
 * 
 * @param  {number} [length=7] Length of the string
 * @return {string} Unique ID
 */
 export function generateUID (length = 7) {
    return Math.random().toString(36).substr(2, 2 + length)
}
