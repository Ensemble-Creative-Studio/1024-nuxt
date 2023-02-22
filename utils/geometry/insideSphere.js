import { onSphere } from './onSphere'

/**
 * Produce a random 3D point within a unit sphere
 * You can pass an existing out array to re-use, instead of creating a new array.
 * 
 * @param  {number} [radius=1] Radius of the sphere
 * @param  {Array}  [out=[]]   Array to return
 * @return {Array} Coordinates of the 3D point
 */
export function insideSphere (radius = 1, out = []) {
    radius *= Math.random()
    out = onSphere(radius, out)
    return out
}
