/**
 * Creates a new component
 *
 * @param {string} tagName - The tag name of component
 * @param {Object} attrs - Attributes of component
 * @param {string[]} classes - Classes of component
 * @param {string} innerHTML - The inner HTML of component
 * @returns {HTMLElement}
 */
export function buildComponent(tagName, attrs, classes, innerHTML) {
  const newComponent = document.createElement(tagName);

  for (const [attr, value] of Object.entries(attrs)) {
    newComponent.setAttribute(attr, value);
  }

  classes?.forEach((ownClass) => {
    newComponent.classList.add(ownClass);
  });

  if (innerHTML) {
    newComponent.innerHTML = innerHTML;
  }

  return newComponent;
}

/**
 * Appends children to the node
 *
 * @param {HTMLElement} parent - The current node
 * @param {HTMLElement[]} children - The appended children
 * @returns {HTMLElement}
 */
export function appendChildren(parent, children) {
  children?.forEach((child) => {
    parent.appendChild(child);
  });

  return parent;
}

/**
 * Replaces children of the node
 *
 * @param {HTMLElement} parent - The current node
 * @param {HTMLElement[]} newChildren - The replaced children
 * @returns {HTMLElement}
 */
export function replaceChildren(parent, newChildren) {
  parent.innerHTML = "";

  newChildren?.forEach((child) => {
    parent.appendChild(child);
  });

  return parent;
}

/**
 * Modifies a existed component
 *
 * @param {HTMLElement} currentNode - The current component
 * @param {Object} attrs - Attributes of component
 * @param {string[]} classes - Classes of component
 * @param {string} innerHTML - The inner HTML of component
 * @returns {HTMLElement}
 */
export function modifyComponent(currentNode, attrs, classes, innerHTML) {
  for (const [attr, value] of Object.entries(attrs) || {}) {
    if (!value) {
      currentNode.removeAttribute(attr);
    } else {
      currentNode.setAttribute(attr, value);
    }
  }

  classes?.forEach((ownClass) => {
    currentNode.classList.toggle(ownClass);
  });

  if (innerHTML) {
    currentNode.innerHTML = innerHTML;
  }

  return currentNode;
}

/**
 * Appends current node to another
 *
 * @param {HTMLElement} currentNode - The current component
 * @param {HTMLElement} parent - The future parent node
 *
 * @returns {HTMLElement}
 */
export function appendsTo(currentNode, parent) {
  parent.appendChild(currentNode);

  return currentNode;
}
