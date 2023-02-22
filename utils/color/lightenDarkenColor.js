import { clamp } from '../math'

/**
 * Lighten or darken a color
 * 
 * @param {string} color      Color in hexadecimal
 * @param {number} [amount=0] Amount
 * @return {string} Computed hexadecimal
 */
export function lightenDarkenColor (color, amount = 0) {
    let prefix = ''

    if (color[0] === '#') {
        color = color.slice(1)
        prefix = '#'
    }

    const num = parseInt(color, 16)

    let r = (num >> 16) + amount
    r = clamp(r, 0, 255)

    let b = ((num >> 8) & 0x00FF) + amount
    b = clamp(b, 0, 255)

    let g = (num & 0x0000FF) + amount
    g = clamp(g, 0, 255)

    let result = g | (b << 8) | (r << 16)

    if (r === 0 && g === 0 && b === 0 && amount !== 0) {
        result = '000000'
    }

    return prefix + (result).toString(16)
}
