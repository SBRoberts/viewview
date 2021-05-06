import {
  Schema,
  SchemaProp,
  SchemaPropValue,
} from "../../modules/schema/types";

const usePlaceholder = (
  schema: Schema,
  { id, value }: SchemaProp
): string | undefined => {
  const isElement = (value: SchemaPropValue) => value instanceof Node;

  const isArrayOfElements = Array.isArray(value) && value.every(isElement);

  if (isArrayOfElements || isElement(value)) {
    return `<del data-id="${id}"></del>`;
  }
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
