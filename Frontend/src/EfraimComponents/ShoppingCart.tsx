import React from "react";
import { useShoppingCart } from "./ShoppingCartContext";
import "./App.css";

const ShoppingCart = () => {
  const { cartItems, removeFromCart, handleCheckout } = useShoppingCart();

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            Show Date ID: {item.reservations[0].showDateId} - Tickets:{" "}
            {item.reservations[0].ticketCount}
            <button onClick={() => removeFromCart(index)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout} disabled={cartItems.length === 0}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default ShoppingCart;
