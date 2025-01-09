import React, { useState, useEffect } from "react";

const ShoppingCart = () => {
  const [cart, setCart] = useState<any[]>([]);

  // Load cart from local storage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Remove a ticket from the cart
  const removeFromCart = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Checkout and send cart content to the reservation endpoint
  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      });

      if (response.ok) {
        alert("Reservations completed successfully!");
        setCart([]);
        localStorage.removeItem("cart");
      } else {
        alert("Failed to complete reservations.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.length > 0 ? (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - {item.showId} - {item.date} - {item.tickets} tickets
              <button onClick={() => removeFromCart(index)}>Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
      {cart.length > 0 && (
        <button onClick={handleCheckout}>Proceed to Checkout</button>
      )}
    </div>
  );
};

export default ShoppingCart;
