import React, { useState } from "react";
import { useShoppingCart } from "../EfraimComponents/ShoppingCartContext";
import axios from "axios";
import "../EfraimComponents/Reservation.css";
import "./ShoppingCart.css"; // Add a custom CSS file for styling

const ShoppingCart = () => {
  const { cartItems, updateCartItem, removeFromCart } = useShoppingCart();
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track which reservation is being edited
  const [editingItem, setEditingItem] = useState<any>(null); // Store the current item being edited

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingItem({ ...cartItems[index] }); // Clone the item for editing
  };

  const handleEditChange = (field: string, value: string | number) => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        [field]: value,
      });
    }
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingItem) {
      updateCartItem(editingIndex, editingItem);
      setEditingIndex(null);
      setEditingItem(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingItem(null);
  };

  const handleRemove = (index: number) => {
    removeFromCart(index);
  };

  const handleCheckout = async () => {
    try {
      // Validate that all required fields are filled
      for (const item of cartItems) {
        if (!item.firstName || !item.lastName || !item.email) {
          alert(
            "All reservations must have a First Name, Last Name, and Email."
          );
          return;
        }
      }

      // Extract customer details from the first cart item
      const { firstName, lastName, email } = cartItems[0];

      // Map cart items to reservations
      const reservations = cartItems.map((item) => ({
        showDateId: item.showDateId,
        ticketCount: item.ticketCount,
      }));

      // Build the request body
      const requestBody = {
        firstName,
        lastName,
        email,
        reservations,
      };

      console.log("Request Body:", requestBody);

      // Send the request
      await axios.post(
        "http://localhost:5097/api/v1/Reservations",
        requestBody
      );

      alert("Checkout completed successfully. Redirecting to home page...");
      window.location.href = "/"; // Redirect to home
    } catch (error: any) {
      console.error(
        "Error during checkout:",
        error.response?.data || error.message
      );
      alert(
        "An error occurred during checkout. Please check the details and try again."
      );
    }
  };

  return (
    <div className="shopping-cart">
      <h2 className="cart-title">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-details">
          {cartItems.map((item, index) => (
            <div key={index} className="cart-item card">
              {editingIndex === index ? (
                <>
                  <div className="cart-field">
                    <label>First Name:</label>
                    <input
                      type="text"
                      value={editingItem.firstName}
                      onChange={(e) =>
                        handleEditChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className="cart-field">
                    <label>Last Name:</label>
                    <input
                      type="text"
                      value={editingItem.lastName}
                      onChange={(e) =>
                        handleEditChange("lastName", e.target.value)
                      }
                    />
                  </div>
                  <div className="cart-field">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={editingItem.email}
                      onChange={(e) =>
                        handleEditChange("email", e.target.value)
                      }
                    />
                  </div>
                  <div className="cart-field">
                    <label>Show:</label>
                    <p>{item.showTitle}</p>
                  </div>
                  <div className="cart-field">
                    <label>Date:</label>
                    <p>{new Date(item.dateAndTime).toLocaleString()}</p>
                  </div>
                  <div className="cart-field">
                    <label>Ticket Count:</label>
                    <input
                      type="number"
                      min="1"
                      value={editingItem.ticketCount}
                      onChange={(e) =>
                        handleEditChange(
                          "ticketCount",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="cart-actions">
                    <button className="btn save-btn" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="btn cancel-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="cart-field">
                    <label>First Name:</label>
                    <p>{item.firstName}</p>
                  </div>
                  <div className="cart-field">
                    <label>Last Name:</label>
                    <p>{item.lastName}</p>
                  </div>
                  <div className="cart-field">
                    <label>Email:</label>
                    <p>{item.email}</p>
                  </div>
                  <div className="cart-field">
                    <label>Show:</label>
                    <p>{item.showTitle}</p>
                  </div>
                  <div className="cart-field">
                    <label>Date:</label>
                    <p>{new Date(item.dateAndTime).toLocaleString()}</p>
                  </div>
                  <div className="cart-field">
                    <label>Ticket Count:</label>
                    <p>{item.ticketCount}</p>
                  </div>
                  <div className="cart-actions">
                    <button
                      className="btn edit-btn"
                      onClick={() => startEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn remove-btn"
                      onClick={() => handleRemove(index)}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="cart-footer-actions">
        <button
          className="btn add-reservations-btn"
          onClick={() => (window.location.href = "/ReservationForm")}
        >
          Add More Reservations
        </button>
        <button className="btn checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
