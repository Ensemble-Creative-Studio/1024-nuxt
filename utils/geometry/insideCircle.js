import { onCircle } from './onCircle'

/**
 * Produce a random 2D point inside a unit circle
 * You can pass an existing out array to re-use, instead of creating a new array.
 * 
 * @param  {number} [radius=1] Radius of the circle
 * @param  {Array}  [out=[]]   Array to return
 * @return {Array} Coordinates of the 2D point
 */
export function insideCircle (radius = 1, out = []) {
    radius *= Math.random()
    out = onCircle(radius, out)
    return out
}
