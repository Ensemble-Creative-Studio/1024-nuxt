/**
 * Make a target fit a container (cover mode)
 * 
 * @param {Object} target
 * @param {Object} container
 * @return {Object}
 */
export function cover (target, container) {
    return fit(target, container, true)
}

/**
 * Make a target fit a container (contain mode)
 * 
 * @param {Object} target
 * @param {Object} container
 * @return {Object}
 */
export function contain (target, container) {
    return fit(target, container, false)    
}

function fit (target, container, cover) {
    const containerWidth  = container.width  || container.w || container.x || 0
    const containerHeight = container.height || container.h || container.y || 0
    const targetWidth  = target.width  || target.w || target.x || 0
    const targetHeight = target.height || target.h || target.y || 0

    const ratioWidth  = containerWidth / targetWidth
    const ratioHeight = containerHeight / targetHeight
    let ratio

    if (cover) {
        ratio = (ratioWidth > ratioHeight) ? ratioWidth : ratioHeight
    } else {
        ratio = (ratioWidth < ratioHeight) ? ratioWidth : ratioHeight
    }

    return {
        left: (containerWidth - targetWidth * ratio) >> 1,
        top: (containerHeight - targetHeight * ratio) >> 1,
        width: targetWidth * ratio,
        height: targetHeight * ratio,
        scale: ratio
    }
}
