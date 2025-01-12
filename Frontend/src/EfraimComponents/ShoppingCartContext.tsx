import React, { createContext, useContext, useState, ReactNode } from "react";

interface Reservation {
  firstName: string;
  lastName: string;
  email: string;
  reservations: {
    showDateId: number;
    ticketCount: number;
  }[];
}

interface ShoppingCartContextType {
  cartItems: Reservation[];
  addToCart: (reservation: Reservation) => void;
  removeFromCart: (index: number) => void;
  handleCheckout: () => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(
  undefined
);

export const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Reservation[]>([]);

  const addToCart = (reservation: Reservation) => {
    setCartItems([...cartItems, reservation]);
  };

  const removeFromCart = (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    console.log("Checkout:", cartItems);
    setCartItems([]); // Clear the cart after checkout
  };

  return (
    <ShoppingCartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, handleCheckout }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error(
      "useShoppingCart must be used within a ShoppingCartProvider"
    );
  }
  return context;
};
