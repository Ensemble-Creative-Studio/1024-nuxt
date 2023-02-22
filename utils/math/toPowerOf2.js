/**
 * Find smallest/closest power of 2 that fits a number
 * 
 * @param {number} number
 * @param {string} [roundMethodName='ceil'] Can be 'ceil' | 'round' | 'floor'
 * @return {number} Power of 2
 */
export function toPowerOf2 (number, roundMethodName = 'ceil') {
    return Math.pow(2, Math[roundMethodName](Math.log(number) / Math.log(2)))
}
