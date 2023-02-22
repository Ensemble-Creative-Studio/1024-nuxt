import { randomBoolean } from './randomBoolean'

/**
 * Generate random sign (1 or -1)
 * 
 * @param {number} probability
 * @return {number} Either 1 or -1
 */
export function randomSign (probability = 0.5) {
    return randomBoolean(probability) ? 1 : -1
}
