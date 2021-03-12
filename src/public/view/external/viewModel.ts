import { handleSetProp } from "../../useViewModel";
import { useSchema, Schema, schemaPropFactory } from "../../private";
import { View } from "../safe";

/**
 * This method exposes a viewModel on the view if there are any valid properties, which is to say any properties with a defined 'key' property/
 * If there are no valid properties, a viewModel is not exposed
 * @param schema - The schema used to generate the view
 * @param view - The view on which we are exposing a viewModel
 */
export const useViewModel = (schema: Schema): Proxy => {
  const traps = {
    get(model, key) {
      // Expose a secret key that will return the model itself
      if (key === "$prototype") return model;

      // Always return the value of the prop, not the prop object itself on getters
      const prop = model[key];

      if (!prop) return;

      return Reflect.get(prop, "value");
    },
    set(model, key, value) {
      const prop = schema.getPropertyByKey(key);
      // Update the prop, if possible
      return handleSetProp(prop, value);
    },
  };

  const viewModel = schema.props.reduce((viewModel, schemaProp) => {
    const { key, value } = schemaProp;
    if (key) {
      viewModel[key] = schemaProp;
    }
    return viewModel;
  }, {});

  return new Proxy(viewModel, traps);
};
