import {
  Schema,
  SchemaProp,
  SchemaPropValue,
  SchemaPropNotify,
  SchemaPropExpression,
} from "./types";

export const schemaPropFactory =
  (schema: Schema) =>
  (key: string, value: SchemaPropValue): SchemaProp => {
    const prototype = Object.create({
      key,
      id: "_" + Math.random().toString(36).substr(2, 9),
      update: update,
      compute: useCompute(schema),
      observe: useObserve,
    });

    const schemaProp: SchemaProp = Object.assign(prototype, { value });

    return schemaProp;
  };

/**
 * Given a new value:
 * 1. Update the schema property's value
 * 2. Notify each observing property of the updated value
 * @param value The new value to assign to the schema property
 */
function update(value: SchemaPropValue) {
  if (this.value !== value) {
    const newValue = this.expression ? this.expression(value) : value;
    this.observers &&
      this.observers.forEach((notify: SchemaPropNotify) => notify(newValue));

    this.value = newValue;
  }

  return this;
}

/**
 * Display the result of an expression that uses and observes an existing schema property value as a dependency
 */
const useCompute = (schema: Schema) => {
  return function (this: SchemaProp, expression: SchemaPropExpression) {
    const schemaProp = schema.defineProperty(expression(this.value));
    schemaProp.expression = expression;

    this.observe(schemaProp.update, schemaProp);

    return schemaProp;
  };
};

// Notify observing nodes that the value to display has changed
export const nodeUpdater = (node: Node | Attr) => {
  let oldValue = null;
  const parent = node.parentElement;

  return function updateNode(
    this: SchemaProp,
    newValue: SchemaPropValue
  ): void {
    oldValue = this.value;
    if (node.nodeType === Node.ATTRIBUTE_NODE) {
      (<Attr>node).value = (<Attr>node).value.replace(
        oldValue.toString(),
        newValue.toString()
      );
    } else if (Array.isArray(newValue)) {
      node.textContent = "";
      // TODO Extend the 'parent' variable's interface to include a 'replaceChildren' method
      // @ts-ignore – This prop does exists, TS does not recognize it
      parent.replaceChildren(...newValue);
    } else {
      node.textContent = node.textContent.replace(
        oldValue.toString(),
        newValue.toString()
      );
    }
  };
};

/**
 * Add a dom node as an observer whose value is updated in sync with schema property's value
 */
export const useObserve = function (
  callback: SchemaPropNotify,
  context = this
): void {
  this.observers = this.observers || [];
  this.observers.push(callback.bind(context));
};
