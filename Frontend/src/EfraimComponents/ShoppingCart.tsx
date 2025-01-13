import React, { useState } from "react";
import { useShoppingCart } from "../EfraimComponents/ShoppingCartContext";
import axios from "axios";
import styles from "./checkout.module.css";

const ShoppingCart = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart } =
    useShoppingCart();
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

      // Clear the cart after successful checkout
      clearCart();

      // Redirect to home
      window.location.href = "/";
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
    <div className={styles.shoppingCart}>
      <h2 className={styles.cartTitle}>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Your cart is empty.</p>
      ) : (
        <div className={styles.cartDetails}>
          {cartItems.map((item, index) => (
            <div key={index} className={`${styles.cartItem} ${styles.card}`}>
              {editingIndex === index ? (
                <>
                  <div className={styles.cartField}>
                    <label>First Name:</label>
                    <input
                      type="text"
                      value={editingItem.firstName}
                      onChange={(e) =>
                        handleEditChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.cartField}>
                    <label>Last Name:</label>
                    <input
                      type="text"
                      value={editingItem.lastName}
                      onChange={(e) =>
                        handleEditChange("lastName", e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.cartField}>
                    <label>Email:</label>
                    <input
                      type="email"
                      value={editingItem.email}
                      onChange={(e) =>
                        handleEditChange("email", e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.cartField}>
                    <label>Show:</label>
                    <p>{item.showTitle}</p>
                  </div>
                  <div className={styles.cartField}>
                    <label>Date:</label>
                    <p>{new Date(item.dateAndTime).toLocaleString()}</p>
                  </div>
                  <div className={styles.cartField}>
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
                  <div className={styles.cartActions}>
                    <button className={styles.saveBtn} onClick={saveEdit}>
                      Save
                    </button>
                    <button className={styles.cancelBtn} onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.cartField}>
                    <label>First Name:</label>
                    <p>{item.firstName}</p>
                  </div>
                  <div className={styles.cartField}>
                    <label>Last Name:</label>
                    <p>{item.lastName}</p>
                  </div>
                  <div className={styles.cartField}>
                    <label>Email:</label>
                    <p>{item.email}</p>
                  </div>
                  <div className={styles.cartField}>
                    <label>Show:</label>
                    <p>{item.showTitle}</p>
                  </div>
                  <div className={styles.cartField}>
                    <label>Date:</label>
                    <p>{new Date(item.dateAndTime).toLocaleString()}</p>
                  </div>
                  <div className={styles.cartField}>
                    <label>Ticket Count:</label>
                    <p>{item.ticketCount}</p>
                  </div>
                  <div className={styles.cartActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => startEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.removeBtn}
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
      <div className={styles.cartFooterActions}>
        <button
          className={styles.addReservationsBtn}
          onClick={() => (window.location.href = "/ReservationForm")}
        >
          Add More Reservations
        </button>
        <button className={styles.checkoutBtn} onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
