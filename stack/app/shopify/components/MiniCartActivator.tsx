import { useMiniCartOpen } from "./MiniCart";
import { useCart } from "@shopify/hydrogen";

export type MiniCartActivatorProps = {
  className?: string;
};

export const MiniCartActivator = ({ className }: MiniCartActivatorProps) => {
  const cart = useCart();
  const [open, setOpen] = useMiniCartOpen();

  return (
    <div
      className={`relative flex h-[60px] cursor-pointer items-center hover:opacity-60 ${className}`}
    >
      <button
        className="hover:opacity-85 -m-2 rounded p-2 focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => setOpen(!open)}
        aria-label="Open Mini Cart"
      >
        <svg
          width="26"
          height="32"
          viewBox="0 0 26 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.624 8.29498H20.2856V7.32318C20.2856 3.26246 17.0231 0 13.0319 0C9.04061 0 5.77809 3.26252 5.77809 7.32318V8.29498H1.43971C0.849722 8.29498 0.398438 8.74625 0.398438 9.33625V29.3275C0.398438 30.8198 1.61331 32 3.07094 32H22.9234C24.4156 32 25.5959 30.7851 25.5959 29.3275L25.5956 9.30155C25.6651 8.74618 25.1792 8.29492 24.6238 8.29492L24.624 8.29498ZM7.86051 7.2886C7.86051 4.40792 10.1859 2.0479 13.0319 2.0479C15.878 2.0479 18.2033 4.40785 18.2033 7.2886V8.2604H7.86063L7.86051 7.2886ZM22.9581 29.9176H3.10565C2.75848 29.9176 2.48104 29.6399 2.48104 29.293V10.3429H5.77815V16.0695C5.77815 16.6595 6.22942 17.1108 6.81942 17.1108C7.40943 17.1108 7.8607 16.6595 7.8607 16.0695L7.86045 10.3429H18.2031V16.0695C18.2031 16.6595 18.6544 17.1108 19.2444 17.1108C19.8344 17.1108 20.2857 16.6595 20.2857 16.0695V10.3429H23.5828V29.293C23.5828 29.6399 23.3054 29.9176 22.9582 29.9176H22.9581Z"
            fill="black"
          />
        </svg>
        {cart.totalQuantity > 0 && (
          <span className="absolute bottom-2 right-[-6px] flex h-4 w-4 justify-center rounded-full bg-primary align-middle text-xs text-white">
            {cart.totalQuantity}
          </span>
        )}
      </button>
    </div>
  );
};
