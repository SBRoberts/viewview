import { css } from "@emotion/css";
import globalStyles from "./globalStyles";

const highlightColour = 'mediumaquamarine'

export const productStyles = css`
  &.product {
    align-items: center;
    border: 2px solid ${highlightColour};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    width: 100%;

    * {
      color: #777;
      font-size: 20px;
      text-align: center;
    }
    > *:not(:last-of-type) {
      margin-bottom: 20px;
    }
  }
  .product {
    &__imageContainer {
      height: 40vmin;
    }

    &__image {
      border: 1px solid ${highlightColour};
      border-radius: 10px;
      box-shadow: 0 20px 16px -10px #ddd;
      height: 100%;
      object-fit: cover;
      width: 100%;
    }

    &__headingContainer {
      min-height: 13vmin;
    }

    &__likesContainer,
    &__cartContainer {
      width: 100%;
    }

    &__likeBtn {
      align-items: center;
      background: none;
      border: 1px solid ${highlightColour};
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      font-size: 1em;
      justify-content: center;
      outline: none;
      padding: 5px;
      width: 100%;
    }

    &__thumbsUp {
      display: flex;
      cursor: pointer;
      margin-right: 10px;
      svg {
        fill: ${highlightColour};
        max-width: 50px;
        min-width: 25px;
      }
    }

    &__name {
      font-size: 1.5em;
      margin-bottom: 10px;
    }

    &__description {
      font-size: 1em;
    }

    &__priceContainer {
      /* background: ${highlightColour};
      border-radius: 5px; */
      padding: 5px;
      width: 100%;
    }
    &__price {
      color: ${highlightColour};
      font-size: 1.25em;
      font-weight: 700;
      text-decoration: underline;
      width: 100%;
    }
  }
`;

export const productGridStyles = css`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 3vmin;
  width: 100%;
`;

export const cartStyles = css`
  &.cart,
  .cart {
    background: white;
    border: 2px solid ${highlightColour};
    border-radius: 20px 0 0 20px;
    height: 100vh;
    position: fixed;
    max-width: 100vw;
    min-width: 300px;
    right: 0;
    top: 0;
    transition: transform 0.3s ease-out;

    &--open {
      transform: translateX(0);
    }

    &--closed {
      transform: translateX(100%);
    }

    &__contentContainer {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
    }

    &__controlContainer {
      box-shadow: 0 0 20px 0px #ddd;
      border-radius: 17px 0 0 0;
      background: ${highlightColour};
      text-align: left;
      width: 100%;
    }

    &__control {
      background: none;
      border: none;
      outline: none;
      padding: 15px;
      transition: transform 0.3s ease-out;
      transform: translateX(0);
      &:hover {
        cursor: pointer;
        transform: translateX(0) scale(1.15);
      }
      &--closed {
        transform: translateX(-100%);
        &:hover {
          transform: translateX(-100%) scale(1.15);
        }
        svg {
          fill: ${highlightColour};
        }
      }
      &--open svg {
        fill: white;
      }
    }

    svg {
      /* fill: white; */
      transition: fill 0.3s ease-out;
      width: 50px;
    }

    &__items {
      height: calc(100% - 75px);
      position: relative;
      overflow-y: scroll;
    }

    &__total {
      color: ${highlightColour};
      display: block;
      font-size: 20px;
      font-weight: 400;
      margin-top: 15px;
      padding: 15px;
      position: relative;
      &:before {
        background: ${highlightColour};
        content: "";
        position: absolute;
        left: 0;
        height: 2px;
        top: 0;
        width: 75%;
      }
    }

    &__sum {
      font-weight: 700;
    }
  }
`;

export const cartItemStyles = css`
  &.item,
  .item {
    display: flex;
    font-size: 18px;
    list-style: none;
    margin: 15px;
    &__details {
      flex-grow: 1;
    }
    &__imageContainer {
      display: inline-block;
      height: 15vmin;
      margin-right: 15px;
      width: 15vmin;
    }

    &__image {
      border: 1px solid ${highlightColour};
      border-radius: 10px;
      height: 100%;
      object-fit: cover;
      width: 100%;
    }

    &__nameContainer {
      width: 100%;
    }

    &__priceContainer {
      width: 100%;
    }

    &__quantityContainer {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
      width: 100%;
    }

    &__quantity {
      background: white;
      border: none;
      color: ${highlightColour};
      font-weight: 700;
      font-size: 18px;
    }
    &__btn {
      background: ${highlightColour};
      border-radius: 5px;
      color: white;
      min-width: 30px;
      padding: 3px 5px;
      transition: background 0.3s ease-out, color 0.3s ease-out;
      &:hover {
        background: white;
        color: ${highlightColour};
      }
    }
  }
`;
