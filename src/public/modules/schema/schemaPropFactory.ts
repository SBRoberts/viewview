import { Schema } from "./types";

export const schemaPropFactory = (schema: Schema) => (
  key: string,
  value
): SchemaProp => {
  const prototype = Object.create({
    id: "_" + Math.random().toString(36).substr(2, 9),
    update: update,
    calc: useCalc(schema),
    observe: useObserve,
  });

  const schemaProp = Object.assign(prototype, { key, value });

  return schemaProp;
};

/**
 * Given a new value:
 * 1. Update the schema property's value
 * 2. Notify each observing property of the updated value
 * @param value The new value to assign to the schema property
 */
function update(value) {
  if (this.value !== value) {
    const newValue = this.expression ? this.expression(value) : value;

    this.observers && this.observers.forEach((notify) => notify(newValue));

    this.value = newValue;
  }
  return this;
}

/**
 * Display the result of an expression that uses and observes an existing schema property value as a dependency
 */
const useCalc = (schema: Schema) => {
  return function (expression: Function) {
    const schemaProp = schema.defineProperty(expression(this.value));
    schemaProp.expression = expression;

    this.observe(schemaProp.update, schemaProp);

    return schemaProp;
  };
};

// Notify observing nodes that the value to display has changed
export const nodeUpdater = (node: Text | Attr) => {
  let oldValue = null;

  return function updateNode(newValue): void {
    oldValue = this.value;

    node === typeof "attribute object"
      ? (node.value = node.value.replace(oldValue, newValue))
      : (node.textContent = node.textContent.replace(oldValue, newValue));
  };
};

/**
 * Add a dom node as an observer whose value is updated in sync with schema property's value
 */
export const useObserve = function (callback, property = this): void {
  this.observers = this.observers || [];
  this.observers.push(callback.bind(property));
};
