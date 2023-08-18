import { FiShoppingCart, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useEffect } from "react";
import { useCommercetoolsCart } from "~/commercetools/context/CommercetoolsCartContext";
import { getActiveCart } from "~/commercetools/utils/cart";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { cart, setCart } = useCommercetoolsCart();

  useEffect(() => {
    async function fetchCart() {
      const activeCart = await getActiveCart();
      setCart(activeCart);
    }

    fetchCart();
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.linkContainer}>
        <h3>
          <Link href="/">Home</Link>
        </h3>
        <h3>
          <Link href="/commercetools">Products List</Link>
        </h3>
        <Link href="/commercetools/account">
          <div className={styles.accountContainer}>
            <FiUser size={36} />
            <span>Account</span>
          </div>
        </Link>
        <Link href="/commercetools/cart">
          <div className={styles.cartContainer}>
            <FiShoppingCart size={36} />
            <span>{cart?.lineItems.length}</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
