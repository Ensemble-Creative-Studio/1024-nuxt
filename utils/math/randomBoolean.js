/**
 * Generate random boolean (true or false)
 * 
 * @param {number} probability Probability to get true
 * @return {boolean} Either true or false
 */
export function randomBoolean (probability = 0.5) {
    return (Math.random() < probability)
}
