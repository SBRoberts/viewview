/**
 * @description call the collect method to create an object containing all dom nodes with a 'ref' attribute
 * @returns An object containing keys with the 'ref' attribute name and values with the dom nodes themselves
 */
export const useCollect = function (view): any {
  const refs = view.querySelectorAll(`[ref]`);
  return () =>
    Array.from(refs).reduce((collectedElements, node) => {
      const ref = node.getAttribute("ref");
      collectedElements[ref] = node;
      return collectedElements;
    }, {});
};
