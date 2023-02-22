export function removeClasses(element, classToKeep) {
  const classes = element.className.split(' ')
  if (classes.length > 1) {
    const firstClass = classes[0]

    for (let i = 1; i < classes.length; i++) {
      if (classes[i] === classToKeep) {
        continue // Skip the "important" class
      } else if (element.classList.contains(classes[i])) {
        continue // Do nothing if the class is already present
      } else {
        element.classList.remove(classes[i]) // Remove the class
      }
    }
    element.className = firstClass // Set the element's class to only the first class
  }
}
