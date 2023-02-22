const rootPosition = { left: 0, top: 0 }

/**
 * Get relative position in an element on a mouse/touch event
 * 
 * @param  {number}  clientX  Event clientX value
 * @param  {number}  clientY  Event clientY value
 * @param  {Element} target   Target element which the touch event should be relative to
 * @param  {Array}   [out=[]] Array to return
 * @return {Array} Relative position of the input click
 */
 export function inputOffset (clientX, clientY, target, out = []) {
    const { left, top } = getBoundingClientOffset(target)
    out[0] = clientX - left
    out[1] = clientY - top
    return out
}

function getBoundingClientOffset (element) {
    if (element === window || element === document || element === document.body) {
        return rootPosition
    } else {
        return element.getBoundingClientRect()
    }
}
