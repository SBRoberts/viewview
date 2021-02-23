import { ProductGrid } from "./components/ProductGrid";
import { Cart } from "./components/Cart";
import { cart, products } from "./data";

const appRoot = document.getElementById("root");

const CartEl = Cart(cart);

const Products = ProductGrid(products, CartEl.viewModel);

appRoot.append(CartEl, Products);
