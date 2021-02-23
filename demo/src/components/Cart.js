import { view, useViewModel } from "../../../src/main";
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
    items: cart.getAll().map((item) => CartItem(item)),
    total: 0,
  });

  // Compute initial values
  state.total = deriveCartTotal(state.items);

  // Destructure keys for ease of use
  const { $isOpen, $items, $total } = state;

  // Open/Close callback
  const openCallback = (isOpen) => (isOpen ? "open" : "closed");

  // Construct the view
  const element = view`
    <div ref="cartContainer" class="${cartStyles} cart cart--${$isOpen.compute(
    openCallback
  )}">
      <div class="cart__contentContainer">
        <div  class="cart__controlContainer">
          <button ref="cartBtn" class="cart__control cart__control--${$isOpen.compute(
            openCallback
          )}">
            ${CartIcon()}
          </button>
        </div>
        <ul class="cart__items">
          ${$items}
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

  // Subscribe to any cart changes – this implementation has nothing to do with viewview
  cart.subscribe((newItems) => {
    state.items = newItems.map((item) => CartItem(item));
    state.total = deriveCartTotal(newItems);
  });

  console.log("state", state);
  console.log("element.viewModel", element.viewModel);

  return element;
};
