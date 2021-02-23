import { view, useViewModel } from "../../../src/main";
import { Product } from "./Product";
import { productGridStyles } from "../styles";

export const ProductGrid = (products, CartEl) => {
  const element = view`
    <div class="productGrid ${productGridStyles}">
      ${products.map((product) => Product(product, CartEl))}
    </div>
  `;

  return element;
};
