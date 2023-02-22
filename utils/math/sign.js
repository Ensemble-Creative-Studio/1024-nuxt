/**
 * Return the sign (positive or negative) of a number
 * 
 * @param {number} number
 * @return {number} 1 if the given number is positive, -1 otherwise if it is negative, otherwise 0
 */
 export function sign (number) {
    if (number > 0) return 1
    else if (number < 0) return -1
    return 0
}
