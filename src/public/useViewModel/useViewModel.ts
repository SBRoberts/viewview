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
      // If the key is prefixed with a `$`, we are building the view and should always return the prop object, if possible
      const isContructing = key[0] === "$";
      key = isContructing ? key.replace("$", "") : key;

      // If prop doesn't exist return undefined
      if (!(key in model)) return;

      // Maintain use of static methods, like array.map
      if (key in model.__proto__) {
        return Reflect.get(...arguments);
      }

      const prop = model[key];

      // Return the prop value if the prop has ben defined in our schema.
      if (!isContructing && schema.hasProperty(key)) {
        console.log("prop", prop);
        return Reflect.get(prop, "value");
      }

      // Our property exists in our model, but not in our schema. Let's define and return it
      const schemaProp = schema.defineProperty(prop, key);
      model[key] = schemaProp;
      return schemaProp;
    },
    set(model, key, value) {
      // Update the prop, if possible
      const prop = schema.getPropertyByKey(key);
      return handleSetProp(prop, value);
    },
  };

  const proxy = new Proxy(model, traps);
  return proxy;
};
