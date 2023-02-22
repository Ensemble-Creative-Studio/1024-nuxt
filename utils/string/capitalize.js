/**
 * Capitalize a string
 * 
 * @param  {string} string String to capitalize
 * @return {string} Capitalized string
 */
export function capitalize (string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
