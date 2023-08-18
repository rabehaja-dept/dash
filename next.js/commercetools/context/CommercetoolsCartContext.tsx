import React, { createContext, useState, useContext } from "react";
import { Cart } from "@deptdash/commercetools";

interface CartContextType {
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
}

const CommercetoolsCartContext = createContext<CartContextType>({
  cart: null,
  setCart: () => {},
});

export const CommercetoolsCartProvider: React.FC<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);

  return (
    <CommercetoolsCartContext.Provider value={{ cart, setCart }}>
      {children}
    </CommercetoolsCartContext.Provider>
  );
};

export const useCommercetoolsCart = () => useContext(CommercetoolsCartContext);
