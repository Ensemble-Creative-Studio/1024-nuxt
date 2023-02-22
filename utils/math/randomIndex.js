/**
 * Return a random index from an array of weights
 * 
 * @param {Array} weights
 * @return {number} Index
 */
export function randomIndex (weights = []) {
    if (weights.length === 0) return -1

    let totalWeight = 0
    for (let weight of weights) {
        totalWeight += weight
    }

    if (totalWeight <= 0) console.warn('randomIndex()', 'Weights must sum to > 0')

    let random = Math.random() * totalWeight
    for (let i = 0; i < weights.length; i++) {
        if (random < weights[i]) {
            return i
        }
        random -= weights[i]
    }

    return 0
}
