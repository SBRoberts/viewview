import { Schema } from "../../modules";

const usePlaceholder = (schema, { id, value }): string | undefined => {
  const isElement = (node) =>
    node instanceof DocumentFragment || node instanceof HTMLElement;
  const isArrayOfElements = Array.isArray(value) && value.every(isElement);
  if (isArrayOfElements || isElement(value)) {
    return `<del data-id="${id}"></del>`;
  }

  return false;
};

// Interleave the template string's string and argument pieces together
export const interleaveTemplateLiteral = (
  strings: string[],
  args: any[],
  schema: Schema
): string =>
  args
    .reduce(
      (acc, arg, index) => {
        const schemaProp = schema.defineProperty(arg);
        const argument = usePlaceholder(schema, schemaProp) || schemaProp.id;
        return [...acc, argument, strings[index + 1]];
      },
      [strings[0]]
    )
    .join("");
