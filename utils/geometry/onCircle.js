/**
 * Produce a random 2D point around the perimiter of a unit circle
 * You can pass an existing out array to re-use, instead of creating a new array.
 * 
 * @param  {number} [radius=1] Radius of the circle
 * @param  {Array}  [out=[]]   Array to return
 * @return {Array} Coordinates of the 2D point
 */
export function onCircle (radius = 1, out = []) {
    const angle = Math.random() * 2.0 * Math.PI
    out[0] = radius * Math.cos(angle)
    out[1] = radius * Math.sin(angle)
    return out
}
