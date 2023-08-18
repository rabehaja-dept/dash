import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "~/components/interactive";
import clsx from "clsx";

export type FloatingCartProps = {
  numberOfItems?: number;
  content?: React.ReactNode;
  className?: string;
};

/**
 * FloatingCart
 * @description A floating cart
 * You'll need to adjust the position and activator to use this component.
 */
export const FloatingCart = ({
  content,
  numberOfItems = 0,
  className,
}: FloatingCartProps) => {
  let [isOpen, setIsOpen] = useState(true);

  const toShoppingCart = () => {
    // ...
  };

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <Dialog onClose={() => setIsOpen(false)}>
        <Dialog.Panel
          className={clsx("max-w-[400px] bg-white p-10", className)}
        >
          <Dialog.Title className="mb-6">
            <h2 className="text-title-sm font-light">Shopping Cart</h2>
            <p className="text-body-sm font-light">
              You've added {numberOfItems}
              {numberOfItems === 1 ? " item" : " items"}
            </p>
          </Dialog.Title>

          {content}

          <Button
            onClick={toShoppingCart}
            variant="primary"
            className="mt-6"
            block
          >
            To Shopping Cart
          </Button>
        </Dialog.Panel>
      </Dialog>
    </Transition>
  );
};
