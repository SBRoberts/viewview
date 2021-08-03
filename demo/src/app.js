// Components
import { ProductGrid } from "./components/ProductGrid";
import { Cart } from "./components/Cart";

// Mock Data
import { cart, products } from "./data";

const init = () => {
  // Find the app's root element
  const appRoot = document.getElementById("root");

  // Append views to DOM
  appRoot.append(Cart(cart), ProductGrid(products));
};

document.addEventListener("DOMContentLoaded", init);
