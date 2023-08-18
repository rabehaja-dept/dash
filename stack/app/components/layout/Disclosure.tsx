import {
  Disclosure as HeadlessDisclosure,
  Transition,
} from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

export type DisclosureProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export const Disclosure = ({ children, title, className }: DisclosureProps) => {
  return (
    <HeadlessDisclosure>
      {({ open }) => (
        <div className={className}>
          <HeadlessDisclosure.Button className="my-4 flex w-full flex-row items-center justify-between">
            <span className="text-body-lg font-light">{title}</span>
            {open ? (
              <MinusIcon className="ml-2 h-4 w-4" />
            ) : (
              <PlusIcon className="ml-2 h-4 w-4" />
            )}
          </HeadlessDisclosure.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <HeadlessDisclosure.Panel static className="mb-6">
              {children}
            </HeadlessDisclosure.Panel>
          </Transition>
        </div>
      )}
    </HeadlessDisclosure>
  );
};
