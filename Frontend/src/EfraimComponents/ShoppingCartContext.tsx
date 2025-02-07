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
  showDateId: number;
  firstName: string;
  lastName: string;
  email: string;
  price: number;
  discountedPrice?: number | null;
}

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
}

interface ShoppingCartContextType {
  cartItems: Reservation[];
  addToCart: (reservation: Reservation) => void;
  updateCartItem: (index: number, updatedReservation: Reservation) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void; // New method to clear the cart
  setCustomerDetails: (details: CustomerDetails) => void;
  customerDetails: CustomerDetails;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(
  undefined
);

export const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Reservation[]>(() => {
    const storedCart = localStorage.getItem("shoppingCart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [customerDetails, setCustomerDetailsState] = useState<CustomerDetails>(
    () => {
      const storedDetails = localStorage.getItem("customerDetails");
      return storedDetails
        ? JSON.parse(storedDetails)
        : { firstName: "", lastName: "", email: "" };
    }
  );

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync customer details with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customerDetails", JSON.stringify(customerDetails));
  }, [customerDetails]);

  const addToCart = (reservation: Reservation) => {
    const { price, discountedPrice } = reservation;

    if (price === undefined) {
      console.error("Price is missing for the reservation:", reservation);
    }

    setCartItems([
      ...cartItems,
      {
        ...reservation,
        price: price || 0,
        discountedPrice: discountedPrice || null,
      },
    ]);
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

  const clearCart = () => {
    setCartItems([]); // Clear the cart
  };

  const setCustomerDetails = (details: CustomerDetails) => {
    setCustomerDetailsState(details);
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart, // Expose the clearCart method
        setCustomerDetails,
        customerDetails,
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
