import { view, useViewModel } from "../../../src/main";
import { cartItemStyles } from "../styles";
import { cart } from "../data";

export const CartItem = (product) => {
  const state = useViewModel(product);

  const { $id, $image, $name, $quantity, $price } = state;

  const element = view`
    <li class="item ${cartItemStyles}" data-id="${$id}">
      <div class="item__imageContainer">
        <img class ="item__image" src="${$image}" alt="${$name}" />
      </div>
      <div class="item__details">
        <div class="item__nameContainer">
          <p>${$name}</p>
        </div>
        <div class="item__quantityContainer">
          <button ref="minusBtn" class="item__quantity item__quantity--minus item__btn">-</button>
          <p class="item__quantity">${$quantity}</p>
          <button ref="plusBtn" class="item__quantity item__quantity--plus item__btn">+</button>
        </div>
        <div class="item__priceContainer">
          <p>
            Price: $${$price.compute((price) => price * state.quantity)}
          </p>
        </div>
      </div>
    </li>
  `;

  const { plusBtn, minusBtn } = element.collect();

  plusBtn.addEventListener("click", () => cart.addItem(state.id));
  minusBtn.addEventListener("click", () => cart.removeItem(state.id));

  return element;
};
