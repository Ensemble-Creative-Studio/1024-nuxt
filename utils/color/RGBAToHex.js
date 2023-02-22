import { clamp } from '../math'

/**
 * Convert RGBA color to hexadecimal
 * 
 * @param  {Array} rgba RGBA color
 * @return {number} Hexadecimal color
 */
export function RGBAToHex (r, g, b, a = 1) {
    return ((r[0] || r) * 255) << 16 ^ ((r[1] || g) * 255) << 8 ^ ((r[2] || b) * 255) << 0
}

/**
 * Convert RGBA color to hexadecimal string
 * 
 * @param  {Array} rgba RGBA color
 * @return {string} Hexadecimal string
 */
export function RGBAToHexString (r, g, b, a = 1) {
    const red = clamp(0, 255, Math.round((r[0] || r) * 255))
    const green = clamp(0, 255, Math.round((r[1] || g) * 255))
    const blue = clamp(0, 255, Math.round((r[2] || b) * 255))
    const alpha = clamp(0, 255, Math.round((r[3] || a) * 255))

    const alphaParam = alpha === 255 ? '' : (alpha | 1 << 8).toString(16).slice(1)
    const result = ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1) + alphaParam
    return '#' + result
}
