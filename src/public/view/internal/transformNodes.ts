import { Schema, nodeUpdater } from "../../modules";
import { View } from "../types";

const deriveArgType = (value) => {
  if (Array.isArray(value)) {
    return "array";
  }
  if (value instanceof DocumentFragment || value instanceof Element) {
    return "element";
  }
  return typeof value;
};

// Replace the current text node's containing id w/ its intended value
const transformTextNode = (schemaProp) => {
  const { id, value } = schemaProp;
  return (node: Text) => {
    const valueType = deriveArgType(value);

    // If the current text node contains the current id, do stuff
    if (node.textContent.includes(id)) {
      schemaProp.observe(nodeUpdater(node), schemaProp);
      // console.log("schemaProp", schemaProp);
      // console.log("node", node);

      if (valueType === "array") {
        value.forEach(transformTextNode(schemaProp));
        node.textContent = node.textContent.replace(id, "");
      } else if (valueType !== "object") {
        // console.log("node", node);
        // console.log("id", id);
        // console.log("value", value);
        node.textContent = node.textContent.replace(id, value);
      }
    }
  };
};

// Loop through every text node replacing any ids w/ their intended value
const transformTextNodes = (textNodes, schemaProp) =>
  textNodes.forEach(transformTextNode(schemaProp));

// Replace the current attribute node's containing id w/ its intended value
const transformAttribute = (schemaProp) => {
  const { id, value } = schemaProp;
  return (node) => {
    if (!node.value.includes(id) || node.name === "data-id") return;
    schemaProp.observe(nodeUpdater(node), schemaProp);
    node.value = node.value.replace(id, value);
  };
};

// Loop through every attribute replacing any ids w/ their intended value
const transformAttributes = (attributes, schemaProp) =>
  attributes.forEach(transformAttribute(schemaProp));

// Given an ID, replace any occurence of that id in the DOM Node's attributes or text w/ its inteded value
const transformContent = ({ node }) => {
  const { attributes, childNodes } = node;

  // Get all attribute nodes in current node as an array
  const attrs = Array.from(attributes);

  // Get all text nodes in current node as an array
  const textNodes = Array.from(childNodes).filter(
    ({ nodeType, textContent }) =>
      nodeType === Node.TEXT_NODE && textContent.trim()
  );

  // Loop through all of the current node's attributs/text and replace the given id w/ the intended value
  return (schemaProp) => {
    transformTextNodes(textNodes, schemaProp);
    transformAttributes(attrs, schemaProp);
  };
};

// Given a DOM Node, iterate through schema ids replacing each textNode and attribute w/ schema val
const transformChildNode = ({ schemaProps }) => (node) =>
  schemaProps.forEach(transformContent({ node }));

const appendChildren = (schema: Schema, view: View) => (schemaProp) => {
  const { id, value } = schemaProp;
  const placeholder = view.querySelector(`del[data-id="${id}"`);
  if (placeholder) {
    const arrayifiedVal = Array.isArray(value) ? value : [value];
    arrayifiedVal.forEach(
      ({ viewModel }) => viewModel && schema.defineProperty(viewModel)
    );
    placeholder.replaceWith(...arrayifiedVal);
  }
};

export const transformNodes = (schema: Schema, view: View): View => {
  const schemaProps = schema.props;
  schemaProps.forEach(appendChildren(schema, view));

  const elements = Array.from(view.querySelectorAll("*"));
  elements.forEach(transformChildNode({ schemaProps }));
  return view;
};
