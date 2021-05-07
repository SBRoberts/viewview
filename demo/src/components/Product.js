import { view, useViewModel } from "../../../src";
import { productStyles } from "../styles";
import { ThumbsUp } from "./Icons";
import { cart } from "../data";

export const Product = (product) => {
  const state = useViewModel(product);

  const element = view`
    <div class="${productStyles} product">
      <div class="product__imageContainer">
        <img class ="product__image" src="${state.$image}" alt="${
    state.$name
  }" />
      </div>
      <div class="product__headingContainer">
        <h3 class="product__name">${state.$name}</h3>
        <p class="product__description">${state.$description}</p>
      </div>
      <div class="product__priceContainer">
        <h4 class="product__price">$${state.$price}</h4>
      </div>
      <div class="product__likesContainer">
      <button ref="likeBtn" class="product__likeBtn">
      <span class="product__thumbsUp">
      ${ThumbsUp()}
      </span>
      <span>${state.$likes}</span>
      </button>
      </div>
      
      <div class="product__cartContainer">
        <button ref="cartBtn" class="product__likeBtn">
          Add To Cart
        </button>
      </div>
    </div>
  `;

  const { likeBtn, cartBtn } = element.collect();

  likeBtn.addEventListener("click", () => (state.likes += 1));
  cartBtn.addEventListener("click", () => cart.addItem(product.id));

  return element;
};
