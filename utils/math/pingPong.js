import { modAbs } from './modAbs'

/**
 * Move back and forth a value between 0 and length, so that it is never larger than length and never smaller than 0
 * 
 * @param {number} value
 * @param {number} length
 * @return {number} PingPonged value
 */
export function pingPong (value, length) {
    value = modAbs(value, length * 2)
    return length - Math.abs(value - length)
}
