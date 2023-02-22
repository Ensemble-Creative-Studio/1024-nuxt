const rgbaBlack = [0, 0, 0, 1]

/**
 * Convert hexadecimal color to RGBA
 * 
 * @param  {number|string} hex Hexadecimal color
 * @return {Array} RGBA color
 */
 export function hexToRGBA (hex) {
    if (typeof hex === 'number') {
        hex = Math.floor(hex)

        const red = (hex >> 16 & 255) / 255
        const green = (hex >> 8 & 255) / 255
        const blue = (hex & 255) / 255

        return [red, green, blue, 1]
    } else if (typeof hex === 'string') {
        hex = hex.toLowerCase().replace(/^#/, '')
        if (!/^[a-f0-9]+$/.test(hex)) {
            return rgbaBlack
        }

        let alpha = 1

        if (hex.length === 8) {
            alpha = parseInt(hex.slice(6, 8), 16) / 255
            hex = hex.slice(0, 6)
        } else if (hex.length === 4) {
            alpha = parseInt(hex.slice(3, 4).repeat(2), 16) / 255
            hex = hex.slice(0, 3)
        } else if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
        }

        const num = parseInt(hex, 16)
        const red = (num >> 16) & 255
        const green = (num >> 8) & 255
        const blue = num & 255

        return [red, green, blue, alpha]
    } else {
        console.warn('hexToRGBA()', 'Must specify a string or a number to convert into a RGBA array')
        return rgbaBlack
    }
}
