// Components
import { ProductGrid } from "./components/ProductGrid";
import { Cart } from "./components/Cart";

// Mock Data
import { cart, products } from "./data";

const init = () => {
  // Find the app's root element
  const appRoot = document.getElementById("root");

  // Construct views
  const CartElement = Cart(cart);
  const ProductGridElement = ProductGrid(products);

  // Append views to DOM
  appRoot.append(CartElement, ProductGridElement);
};

document.addEventListener("DOMContentLoaded", init);
