import { view, useViewModel } from "../../../src";
import { cartStyles } from "../styles";
import { CartItem } from "./CartItem";
import { CartIcon } from "./Icons";
import { cart } from "../data";

const deriveCartTotal = (items) =>
  items.reduce((total, cartItem) => {
    if (cartItem.price) {
      total += cartItem.price * cartItem.quantity;
    }
    return total;
  }, 0);

export const Cart = () => {
  // Initialize state
  const state = useViewModel({
    isOpen: false,
    items: cart.getAll(),
    total: 0,
  });

  // Destructure keys for ease of use
  const { $isOpen, $items, $total } = state;

  // Compute initial values
  state.total = deriveCartTotal(state.items);

  // Define callbacks
  const computedOpenState = $isOpen.compute((isOpen) => (isOpen ? "open" : "closed"));
  const computedCartItems = $items.compute((items) => items.map((item) => CartItem(item)));

  // Construct the view
  const element = view`
    <div ref="cartContainer" class="${cartStyles} cart cart--${computedOpenState}">
      <div class="cart__contentContainer">
        <div  class="cart__controlContainer">
          <button ref="cartBtn" class="cart__control cart__control--${computedOpenState}">
            ${CartIcon()}
          </button>
        </div>
        <ul class="cart__items">
          ${computedCartItems}
        </ul>
        <div class="cart__total">
          Total: <span class="cart__sum">$${$total}</span>
        </div>
      </div>
    </div>
  `;

  // Collect any refs
  const { cartBtn } = element.collect();

  // Handle cart open/close
  cartBtn.addEventListener("click", () => {
    state.isOpen = !state.isOpen;
  });

  // Subscribe to any cart changes – this implementation has nothing to do with the ViewView library
  cart.subscribe((newItems) => {
    state.items = newItems;
    state.total = deriveCartTotal(newItems);
  });

  return element;
};
