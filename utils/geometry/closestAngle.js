/**
 * Find the closest angle betwween to angles
 * 
 * @param {number} source Source angle in radians
 * @param {number} target Target angle in radians
 * @return {number} Closest angle
 */
 export function closestAngle (source, target) {
	const delta = target - source
	return delta > Math.PI ? target - (2 * Math.PI) : target < -Math.PI ? delta + 2 * Math.PI : target
}
