/**
 * Calculate the angle from a point to another
 * 
 * @param  {number} x1 X value of the first point
 * @param  {number} y1 Y value of the first point
 * @param  {number} x2 X value of the second point
 * @param  {number} y2 Y value of the second point
 * @return {number} Angle
 */
export function angle (x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1)
}
