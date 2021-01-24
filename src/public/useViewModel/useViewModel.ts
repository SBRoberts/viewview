/* eslint-disable prefer-rest-params */
import { useSchema, Schema } from "../modules";
import { View } from "../safe";

export const handleSetProp = (prop, value) => {
  // Return undefined if the prop isn't defined.
  if (!prop) return true;

  // Update the prop if the value has changed and an update fn is defined
  prop.value !== value && prop.update(value);

  return prop;
};

/**
 * @description A View Model is a collection of data that is used within your view. When you update this data,
 * your view will also update. If you are reusing properties within your view, it is important to prefix your properties with **`$`**.
 * Otherwise, you can get and set properties in your object like you would normally
 * * Ex: `<span style="color: ${data.$myColour}">${data.$myColour}</span>`
 * @param model the object whose data will populate the view. Updating this model will also update the view.
 */
export const useViewModel = function (
  model: Record<string | number> | any[]
): Proxy {
  const schema: Schema = useSchema();

  model = Array.isArray(model) ? Array.from(model) : Object.assign({}, model);

  // Define proxy intercept methods
  const traps: ProxyHandler = {
    get(model, key) {
      console.log("GET ---");
      // If the key is prefixed with a `$`, we are building the view and should always return the prop object, if possible
      const isContructing = key[0] === "$";
      key = isContructing ? key.replace("$", "") : key;
      console.log("key", key);

      // If prop doesn't exist return undefined
      if (!(key in model)) return;

      // Maintain use of static methods, like array.map
      if (key in model.__proto__) {
        return Reflect.get(...arguments);
      }

      let prop = model[key];
      const isSchemaProp =
        typeof prop === "object" &&
        prop.hasOwnProperty("id") &&
        schema.getPropertyById(prop.id);
      console.log("prop", prop);
      console.log("isSchemaProp", isSchemaProp);
      console.log("prop.id", prop.id);

      // console.log("key", key);

      // Return the prop value if the prop has ben defined in our schema.
      if (isSchemaProp) {
        if (!isContructing) {
          return Reflect.get(prop, "value");
        }
      } else if (typeof prop === "object") {
        if (!isContructing) {
          return Reflect.get(...arguments);
        }
        // console.log("prop", prop);
        prop = new Proxy(prop, this);
        // console.log("prop", prop);
      }

      // console.log("prop", prop);

      // Our property exists in our model, but not in our schema. Let's define and return it
      const schemaProp = schema.defineProperty(prop, key);
      console.log("schemaProp", schemaProp);
      model[key] = schemaProp;
      return schemaProp;
    },
    set(model, key, value) {
      // Update the prop, if possible
      console.log("SET ---");
      console.log("model", model);
      console.log("key", key);
      console.log("value", value);
      const prop = schema.getPropertyByKey(key);
      // // console.log("prop", prop);
      return handleSetProp(prop, value);
    },
  };

  const proxy = new Proxy(model, traps);
  return proxy;
};
