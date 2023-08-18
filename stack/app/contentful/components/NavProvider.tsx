import { createContext, ReactNode, useContext } from "react";
import { INavContainer, SpecificLocale } from "~/@types/generated/contentful";

export type NavContainers = {
  primaryNav: SpecificLocale<INavContainer>;
};

export const NavContext = createContext<NavContainers | null>(null);

export type NavProviderProps = {
  navContainers: NavContainers;
  children: ReactNode;
};

export const NavProvider = ({ navContainers, children }: NavProviderProps) => {
  return (
    <NavContext.Provider value={navContainers}>{children}</NavContext.Provider>
  );
};

export function useNavContainers(): NavContainers {
  const navContainers = useContext(NavContext);
  if (!navContainers) {
    throw new Error("useNavContainers was called without a NavContext");
  }
  return navContainers;
}
