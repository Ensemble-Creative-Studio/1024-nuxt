import { radToSphere } from './radToSphere'

/**
 * Produce a random 3D point on the surface of a unit sphere
 * You can pass an existing out array to re-use, instead of creating a new array.
 * 
 * @param  {number} [radius=1] Radius of the sphere
 * @param  {Array}  [out=[]]   Array to return
 * @return {Array} Coordinates of the 3D point
 */
export function onSphere (radius = 1, out = []) {
    const u = Math.random() * Math.PI * 2
    const v = Math.random() * 2 - 1
    const phi = u
    const theta = Math.acos(v)
    out = radToSphere(radius, phi, theta, out)
    return out
}
