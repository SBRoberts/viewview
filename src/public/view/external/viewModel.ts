import { handleSetProp } from "../../useViewModel";
import { useSchema, Schema } from "../../private";
import { View } from "../types";

/**
 * This method exposes a viewModel on the view if there are any valid properties, which is to say any properties with a defined 'key' property/
 * If there are no valid properties, a viewModel is not exposed
 * @param schema - The schema used to generate the view
 * @param view - The view on which we are exposing a viewModel
 */
export const viewModel = (schema: Schema, view: View): Record<any> | void => {
  let isValidViewModel = false;

  const viewModel = schema.props.reduce((viewModel, schemaProp) => {
    const { key, value } = schemaProp;

    // If the current schema prop value is an array, iterate through and add any child vm to the parent vm
    if (Array.isArray(value)) {
      return value.reduce(
        (viewModel, { viewModel: childVm }) =>
          childVm
            ? (isValidViewModel = true) &&
              Object.assign(viewModel, childVm.$prototype)
            : viewModel,
        viewModel
      );
    }

    // If there is a key, we know the property was created with the intention of being accessible by the user.
    if (key) {
      viewModel[key] = schemaProp;
      isValidViewModel = true;
    }
    return viewModel;
  }, {});

  // Proxy traps
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
      // Update the prop, if possible
      const prop = model[key];
      return handleSetProp(prop, value);
    },
  };

  return isValidViewModel ? new Proxy(viewModel, traps) : undefined;
};
