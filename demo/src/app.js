// Components
import { ProductGrid } from "./components/ProductGrid";
import { Cart } from "./components/Cart";

// Mock Data
import { cart, products } from "./data";

// Find the app's root element
const appRoot = document.getElementById("root");

// Construct views
const CartElement = Cart(cart);
console.log("CartElement", { CartElement });
const ProductGridElement = ProductGrid(products);

// Append views to DOM
appRoot.append(CartElement, ProductGridElement);
