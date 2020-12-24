import { Schema, SchemaProp } from "./types";

const isSchemaProp = (value) =>
  typeof value === "object" &&
  "id" in value &&
  "value" in value &&
  "key" in value;

const schemaPropFactory = (schema: Schema) => (
  key: string,
  value
): SchemaProp => ({
  key,
  value,
  id: "_" + Math.random().toString(36).substr(2, 9),
  calc(expression) {
    const schemaProp = schema.defineProperty(expression(this.value));
    schemaProp.expression = expression;

    this.dependants = this.dependants || [];
    this.dependants.push(schemaProp);

    return schemaProp;
  },
  update(value) {
    if (this.value !== value) {
      const newValue = this.expression ? this.expression(value) : value;

      this.observers && this.observers.forEach((notify) => notify(newValue));

      this.dependants &&
        this.dependants.forEach((schemaProp) => schemaProp.update(newValue));

      this.value = newValue;
    }
    return this;
  },
});

/**
 * @description Create a new schema or use an exisiting one. This schema is a private data structure that is used to establish/define the relationship between our view's data
 * @param instance An object to create the schema with. Defaults to empty object. Can be used to couple several schema's together
 */
export const useSchema = function (instance: Schema | undefined): Schema {
  if (instance) {
    return instance;
  }
  const schema = {
    ids: [],
    props: [],
    defineProperty(value = undefined, key = undefined) {
      const generateSchemaProp = schemaPropFactory(this);

      if (isSchemaProp(value)) {
        const { id } = value;
        if (!this.getPropertyById(id)) {
          this.props.push(value);
          this.ids.push(id);
        }
        return value;
      }

      const prop: SchemaProp = generateSchemaProp(key, value);
      // this[id] = prop;
      this.props.push(prop);
      this.ids.push(prop.id);
      return prop;
    },
    getPropertyByKey(key): SchemaProp {
      return this.props.find(({ key: propKey }) => propKey === key);
    },
    getPropertyByValue(value): SchemaProp {
      return this.props.find(({ value: propValue }) => propValue === value);
    },
    getPropertyById(id): SchemaProp {
      return this.props.find(({ id: propId }) => propId === id);
    },
    hasProperty(key): boolean {
      return this.props.some((item) => item.key === key);
    },
    hasId(id): boolean {
      this.props.some((item) => item.id === id);
    },
  };

  return schema;
};

// Notify observing nodes that the value to display has changed
const useNotify = (node, schemaProp) => {
  let oldValue = null;

  return (newValue): void => {
    oldValue = schemaProp.value;

    node === typeof "attribute object"
      ? (node.value = node.value.replace(oldValue, newValue))
      : (node.textContent = node.textContent.replace(oldValue, newValue));
  };
};

// Create an update for a schema schemaProp with a reference to the node that recieves the update
export const addObserver = function (
  node: Text | Attr,
  schemaProp: SchemaProp
): void {
  schemaProp.observers = schemaProp.observers || [];
  const notifyObserver = useNotify(node, schemaProp);
  schemaProp.observers.push(notifyObserver);
};
