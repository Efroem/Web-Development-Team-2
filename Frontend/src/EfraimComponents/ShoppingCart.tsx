import React, { useState } from "react";
import { useShoppingCart } from "./ShoppingCartContext";
import "../EfraimComponents/Reservation.css";

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

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Show</th>
              <th>Date</th>
              <th>Ticket Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                {editingIndex === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editingItem.showTitle}
                        onChange={(e) =>
                          handleEditChange("showTitle", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        value={new Date(editingItem.dateAndTime)
                          .toISOString()
                          .slice(0, -1)} // Convert to datetime-local format
                        onChange={(e) =>
                          handleEditChange("dateAndTime", e.target.value)
                        }
                      />
                    </td>
                    <td>
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
                    </td>
                    <td>
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.showTitle}</td>
                    <td>{new Date(item.dateAndTime).toLocaleString()}</td>
                    <td>{item.ticketCount}</td>
                    <td>
                      <button onClick={() => startEdit(index)}>Edit</button>
                      <button onClick={() => handleRemove(index)}>
                        Remove
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="cart-actions">
        <button onClick={() => (window.location.href = "/ReservationForm")}>
          Add More Reservations
        </button>
        <button onClick={() => alert("Proceeding to checkout...")}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ShoppingCart;
