/**
 * Convert radians to a 3D point on the surface of a unit sphere
 * 
 * @param  {number} radius Radius of the sphere
 * @param  {number} phi    Polar angle from the y (up) axis     : 0 to PI
 * @param  {number} theta  Equator angle around the y (up) axis : 0 to 2 PI
 * @param  {Array}  [out=[]] Array to return
 * @return {Array} Coordinates of the 3D point
 */
 export function radToSphere (radius, phi, theta, out = []) {
    out[0] = radius * Math.sin(phi) * Math.sin(theta)
    out[1] = radius * Math.cos(phi)
    out[2] = radius * Math.sin(phi) * Math.cos(theta)
    return out
}
