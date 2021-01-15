import { Schema } from "../../modules";

const usePlaceholder = (schema, id, arg): string | undefined => {
  const isElement = (node) =>
    node instanceof DocumentFragment || node instanceof HTMLElement;
  const isArrayOfElements = Array.isArray(arg) && arg.every(isElement);

  if (isArrayOfElements || isElement(arg)) {
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
        const { id } = schema.defineProperty(arg);
        const argument = usePlaceholder(schema, id, arg) || id;
        return [...acc, argument, strings[index + 1]];
      },
      [strings[0]]
    )
    .join("");
