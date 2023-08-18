import { Fragment, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useCart } from "@shopify/hydrogen";

import { createGlobalState } from "react-use";

import { Button } from "~/components/interactive/Button";
import { Price } from "./Price";
import { CartDetails } from "./MiniCartDetails";

/**
 * This component renders initially as a cart icon, and then as a dialog
 * When placed inside the Shopify Context, it should just work™
 * Adapted from https://tailwindui.com/components/application-ui/overlays/slide-overs
 */

// Allow other components to globally capture the state of the cart
export const useMiniCartOpen = createGlobalState<boolean>(() => false);
function usePreviousQuantity(value: number) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef(value);
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export const MiniCart = () => {
  // must be used inside the Shopify & Cart contexts
  const cart = useCart();
  const location = useLocation();
  const [open, setOpen] = useMiniCartOpen();

  const prevCartQuantity = usePreviousQuantity(cart.totalQuantity);

  /**
   * When a user adds a product to the cart, we want to open the mini cart
   * To confirm that their action was successful
   * _Except_ when the user is on the cart page
   */
  useEffect(() => {
    if (location.pathname !== "/shopify/cart") {
      if (prevCartQuantity && prevCartQuantity < cart.totalQuantity) {
        setOpen(true);
      }
    }
  }, [cart.totalQuantity, prevCartQuantity, location.pathname, setOpen]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white pb-4 shadow-xl">
                    <div className="flex items-center justify-end p-2">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon
                          className="h-6 w-6 text-primary hover:text-primary-weak"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <div className="relative mt-6 w-full flex-1 px-4 sm:px-6">
                      <div className="top-0 w-full pb-4 text-right">
                        My Cart ({cart.totalQuantity})
                      </div>
                      <CartDetails />
                      {cart.totalQuantity > 0 ? (
                        <>
                          <div className="text-bold mt-4 w-full text-right">
                            <h5 className="mb-2 flex flex-row justify-end">
                              Subtotal:
                              <Price
                                amount={cart.cost?.subtotalAmount.amount || 0}
                                currencyCode={
                                  cart.cost?.subtotalAmount?.currencyCode ||
                                  "USD"
                                }
                                className="ml-2"
                              />
                            </h5>
                          </div>
                          <Button
                            to="shopify/cart"
                            variant="primary"
                            block
                            onClick={() => setOpen(!open)}
                          >
                            Checkout Now
                          </Button>
                        </>
                      ) : (
                        <Button
                          to="shopify"
                          variant="primary"
                          block
                          onClick={() => setOpen(!open)}
                        >
                          Continue Shopping
                        </Button>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
