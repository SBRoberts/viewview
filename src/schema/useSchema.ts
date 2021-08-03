import { Schema, SchemaProp, SchemaPropValue } from "./types";
import { schemaPropFactory } from "./schemaPropFactory";

const isSchemaProp = (value: SchemaPropValue) =>
  typeof value === "object" &&
  "id" in value &&
  "value" in value &&
  "key" in value;

/**
 * @description Create a new schema or use an exisiting one. This schema is a private data structure that is used to establish/define the relationship between our view's data
 * @param instance An object to create the schema with. Defaults to empty object. Can be used to couple several schema's together
 */
export const useSchema = function (instance?: Schema): Schema {
  if (instance) {
    return instance;
  }
  const schema: Schema = {
    ids: [],
    props: [],
    defineProperty(value, key?) { 
      // Handle schemaProps provided as values
      if (isSchemaProp(value)) {
        const schemaProp = <SchemaProp>value;
        const { id } = schemaProp;
        // Does the schema prop exist in this schema already?
        if (!this.hasId(id)) {
          this.props.push(schemaProp);
          this.ids.push(id);
        }
        
        return schemaProp;
      }
      
      const generateSchemaProp = schemaPropFactory(this);
      const schemaProp: SchemaProp = generateSchemaProp(key, value);

      this.props.push(schemaProp);
      this.ids.push(schemaProp.id);

      return schemaProp;
    },
    getPropertyByKey(key) {
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
      return this.props.some((item) => item.id === id);
    },
  };

  return schema;
};
