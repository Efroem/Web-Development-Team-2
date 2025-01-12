import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Reservation {
  showTitle: string;
  dateAndTime: string;
  ticketCount: number;
}

interface ShoppingCartContextType {
  cartItems: Reservation[];
  addToCart: (reservation: Reservation) => void;
  updateCartItem: (index: number, updatedReservation: Reservation) => void;
  removeFromCart: (index: number) => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(
  undefined
);

export const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Reservation[]>(() => {
    // Initialize cart from localStorage
    const storedCart = localStorage.getItem("shoppingCart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (reservation: Reservation) => {
    setCartItems([...cartItems, reservation]);
  };

  const updateCartItem = (index: number, updatedReservation: Reservation) => {
    const updatedCart = [...cartItems];
    updatedCart[index] = updatedReservation;
    setCartItems(updatedCart);
  };

  const removeFromCart = (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
      }}
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
