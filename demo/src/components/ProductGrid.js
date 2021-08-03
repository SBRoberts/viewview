import { view } from "../../../src";
import { Product } from "./Product";
import { productGridStyles } from "../styles";

export const ProductGrid = (products, CartEl) => {
  const element = view`
    <div class="productGrid ${productGridStyles}" ref="boop">
      ${products.map((product) => Product(product, CartEl))}
    </div>
  `;
  const {boop} = element.collect()
  boop.addEventListener('mouseover', () => console.log('Pretend this is some analytics event'))
  return element;
};
