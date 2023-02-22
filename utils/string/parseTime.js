/**
 * Convert a time value to a string
 * 
 * @param  {number} time            Time to convert
 * @param  {string} [separator=':'] String separating minutes and seconds
 * @return {string} Converted string
 */
export function parseTime (time, separator = ':') {
    const seconds = ('00' + Math.floor(time % 60)).slice(-2)
    const minutes = Math.floor(time / 60)
    return minutes + separator + seconds
}
