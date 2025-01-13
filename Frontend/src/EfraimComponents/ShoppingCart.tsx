import React, { useState } from "react";
import { useShoppingCart } from "../EfraimComponents/ShoppingCartContext";
import axios from "axios";
import styles from "./checkout.module.css";

const ShoppingCart = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart } =
    useShoppingCart();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {}
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingItem({ ...cartItems[index] });
    setErrorMessages({}); // Clear error messages on edit start
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
      const errors: { [key: string]: string } = {};

      if (!editingItem.firstName.trim()) {
        errors.firstName = "First name is required.";
      }
      if (!editingItem.lastName.trim()) {
        errors.lastName = "Last name is required.";
      }
      if (!editingItem.email || !validateEmail(editingItem.email)) {
        errors.email = "Invalid email format.";
      }
      if (editingItem.ticketCount < 1) {
        errors.ticketCount = "Ticket count cannot be less than 1.";
      }

      if (Object.keys(errors).length > 0) {
        setErrorMessages(errors);
        return;
      }

      updateCartItem(editingIndex, editingItem);
      setEditingIndex(null);
      setEditingItem(null);
      setErrorMessages({});
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingItem(null);
    setErrorMessages({}); // Clear error messages on cancel
  };

  const handleRemove = (index: number) => {
    removeFromCart(index);
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        if (!item.firstName || !item.lastName || !item.email) {
          alert(
            "All reservations must have a First Name, Last Name, and Email."
          );
          return;
        }
        if (!validateEmail(item.email)) {
          alert("Invalid email format in one of the reservations.");
          return;
        }
      }

      const { firstName, lastName, email } = cartItems[0];
      const reservations = cartItems.map((item) => ({
        showDateId: item.showDateId,
        ticketCount: item.ticketCount,
      }));

      const requestBody = {
        firstName,
        lastName,
        email,
        reservations,
      };

      await axios.post(
        "http://localhost:5097/api/v1/Reservations",
        requestBody
      );

      alert("Checkout completed successfully. Redirecting to home page...");
      clearCart();
      window.location.href = "/";
    } catch (error: any) {
      console.error(
        "Error during checkout:",
        error.response?.data || error.message
      );
      alert("An error occurred during checkout. Please try again.");
    }
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce(
        (total, item) => total + (item.price || 0) * (item.ticketCount || 1),
        0
      )
      .toFixed(2);
  };

  return (
    <div className={styles.shoppingCart}>
      <h2 className={styles.cartTitle}>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles.cartDetails}>
          {cartItems.map((item, index) => (
            <div key={index} className={`${styles.cartItem} ${styles.card}`}>
              {editingIndex === index ? (
                <>
                  <div className={styles.cartField}>
                    <label>
                      <strong>First Name:</strong>
                      <input
                        type="text"
                        value={editingItem.firstName}
                        onChange={(e) =>
                          handleEditChange("firstName", e.target.value)
                        }
                      />
                      {errorMessages.firstName && (
                        <span className={styles.errorMessage}>
                          {errorMessages.firstName}
                        </span>
                      )}
                    </label>
                  </div>
                  <div className={styles.cartField}>
                    <label>
                      <strong>Last Name:</strong>
                      <input
                        type="text"
                        value={editingItem.lastName}
                        onChange={(e) =>
                          handleEditChange("lastName", e.target.value)
                        }
                      />
                      {errorMessages.lastName && (
                        <span className={styles.errorMessage}>
                          {errorMessages.lastName}
                        </span>
                      )}
                    </label>
                  </div>
                  <div className={styles.cartField}>
                    <label>
                      <strong>Email:</strong>
                      <input
                        type="email"
                        value={editingItem.email}
                        onChange={(e) =>
                          handleEditChange("email", e.target.value)
                        }
                      />
                      {errorMessages.email && (
                        <span className={styles.errorMessage}>
                          {errorMessages.email}
                        </span>
                      )}
                    </label>
                  </div>
                  <div className={styles.cartField}>
                    <label>
                      <strong>Ticket Count:</strong>
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
                      {errorMessages.ticketCount && (
                        <span className={styles.errorMessage}>
                          {errorMessages.ticketCount}
                        </span>
                      )}
                    </label>
                  </div>
                  <div className={styles.cartItemActions}>
                    <button
                      className={`${styles.smallButton} ${styles.saveBtn}`}
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className={`${styles.smallButton} ${styles.cancelBtn}`}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>First Name:</strong> {item.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {item.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {item.email}
                  </p>
                  <p>
                    <strong>Show:</strong> {item.showTitle}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(item.dateAndTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Ticket Count:</strong> {item.ticketCount}
                  </p>
                  <p>
                    <strong>Price per Ticket:</strong> €{item.price}
                  </p>
                  <p>
                    <strong>Total Price:</strong> €
                    {(item.price * item.ticketCount).toFixed(2)}
                  </p>
                  <div className={styles.cartItemActions}>
                    <button
                      className={`${styles.smallButton}`}
                      onClick={() => startEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.smallButton}`}
                      onClick={() => handleRemove(index)}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          <div className={styles.cartTotal}>
            <p>
              <strong>Total Price:</strong> €{calculateTotalPrice()}
            </p>
          </div>
        </div>
      )}
      <div className={styles.cartActions}>
        <button
          className={`${styles.button} ${styles.addReservationsBtn}`}
          onClick={() => (window.location.href = "/ReservationForm")}
        >
          Add More Reservations
        </button>
        <button
          className={`${styles.button} ${styles.checkoutBtn}`}
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};
export default ShoppingCart;
