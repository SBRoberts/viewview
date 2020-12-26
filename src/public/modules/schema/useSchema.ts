import { Schema, SchemaProp } from "./types";
import { schemaPropFactory } from "./schemaPropFactory";

const isSchemaProp = (value) =>
  typeof value === "object" &&
  "id" in value &&
  "value" in value &&
  "key" in value;

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
