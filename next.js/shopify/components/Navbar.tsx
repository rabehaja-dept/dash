import { FiShoppingCart } from "react-icons/fi"; // Importa el icono de carrito de compras
import Link from "next/link";

const Navbar = ({ cart }) => {
  const numberOfItems = cart?.totalQuantity ?? "";

  return (
    <nav>
      <h1>
        <Link href="/">DASH Next</Link>
      </h1>
      <h2>
        <Link href="/shopify">Shopify</Link>
      </h2>
      <Link href="/shopify/cart">
        <div>
          <FiShoppingCart size={36} />
          <span>{numberOfItems}</span>
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
