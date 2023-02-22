import { randomInt } from './randomInt'

/**
 * Pick a random item from an array
 * 
 * @param {Array} [array=[]]
 * @return {any} Random item picked
 */
export function randomItem (array = []) {
    if (array.length === 0) return undefined
    return array[randomInt(0, array.length - 1)]
}
