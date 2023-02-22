const DOCUMENT_NODE_TYPE = 9

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    const proto = Element.prototype
    proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector
}

/**
 * Find the closest parent that matches a selector
 * 
 * @param  {Element}         element
 * @param  {string|Element}  selector
 * @return {Element}
 */
export function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if ((typeof selector === 'string' && element.matches(selector)) || element === selector) {
            return element
        }
        element = element.parentNode
    }
}
