import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export const FilterDrawer = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="flex items-center justify-center gap-3"
        onClick={() => setOpen(!open)}
      >
        <svg
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.959844 5.04549H12.0131C12.2898 6.06245 13.001 6.90565 13.9566 7.34989C14.9125 7.79412 16.0155 7.79412 16.9713 7.34989C17.9271 6.90566 18.6381 6.0625 18.9148 5.04549H21.0183C21.3606 5.04549 21.6769 4.86287 21.8481 4.56647C22.0191 4.27007 22.0191 3.90482 21.8481 3.60842C21.6768 3.31202 21.3605 3.1294 21.0183 3.1294H18.9069C18.6302 2.11225 17.9192 1.26906 16.9634 0.82486C16.0075 0.380665 14.9046 0.380627 13.9487 0.82486C12.9931 1.26909 12.2819 2.11225 12.0052 3.1294H0.959939C0.617698 3.1294 0.301399 3.31202 0.130224 3.60842C-0.0408039 3.90482 -0.0408039 4.27007 0.130224 4.56647C0.301436 4.86287 0.617732 5.04549 0.959939 5.04549H0.959844ZM15.4757 2.40883C15.9207 2.4116 16.3462 2.59091 16.6589 2.90737C16.9717 3.22365 17.146 3.65131 17.1436 4.09612C17.1414 4.54109 16.9625 4.96674 16.6466 5.27987C16.3305 5.59302 15.903 5.76775 15.4582 5.76587C15.0132 5.76403 14.5874 5.58564 14.2739 5.26992C13.9605 4.95419 13.7853 4.52688 13.7866 4.08212C13.7888 3.63623 13.9679 3.20947 14.2845 2.89559C14.6014 2.58188 15.0297 2.40681 15.4756 2.40883H15.4757Z"
            fill="black"
          />
          <path
            d="M21.0166 11.0418H9.96047C9.68524 10.024 8.97443 9.17995 8.01859 8.73519C7.06276 8.29043 5.95927 8.29041 5.00339 8.73519C4.04751 9.17998 3.33694 10.0241 3.06152 11.0418H0.957986C0.615746 11.0418 0.299445 11.2244 0.128271 11.5208C-0.0427571 11.8172 -0.0427571 12.1824 0.128271 12.4788C0.299483 12.7752 0.615779 12.9579 0.957986 12.9579H3.06943C3.34485 13.9756 4.05548 14.8197 5.01131 15.2644C5.96714 15.7092 7.07063 15.7092 8.02651 15.2644C8.98239 14.8196 9.69315 13.9755 9.96839 12.9579H21.0165C21.3587 12.9579 21.675 12.7752 21.8462 12.4788C22.0172 12.1824 22.0172 11.8172 21.8462 11.5208C21.675 11.2244 21.3587 11.0418 21.0165 11.0418H21.0166ZM6.5007 13.6784C6.0561 13.6757 5.63083 13.4965 5.31803 13.1806C5.00543 12.8645 4.83071 12.4374 4.83274 11.9928C4.83458 11.5482 5.0126 11.1226 5.32797 10.8093C5.64334 10.4959 6.07007 10.3203 6.51469 10.3214C6.95929 10.3223 7.38532 10.4994 7.69939 10.8142C8.01346 11.1288 8.18982 11.5552 8.18982 11.9998C8.18908 12.4466 8.0105 12.8748 7.69369 13.1896C7.37666 13.5046 6.94753 13.6804 6.50074 13.6784H6.5007Z"
            fill="black"
          />
          <path
            d="M21.0164 18.9545H18.9049C18.6282 17.9375 17.9172 17.0943 16.9614 16.6501C16.0056 16.2058 14.9026 16.2058 13.9468 16.6501C12.9911 17.0943 12.28 17.9375 12.0033 18.9545H0.957986C0.615745 18.9545 0.299445 19.1371 0.128271 19.4335C-0.0427571 19.7299 -0.0427571 20.0951 0.128271 20.3915C0.299483 20.6879 0.615778 20.8706 0.957986 20.8706H12.0113C12.288 21.8877 12.9991 22.7309 13.9548 23.1751C14.9106 23.6193 16.0136 23.6193 16.9694 23.1751C17.9253 22.7309 18.6363 21.8877 18.913 20.8706H21.0165C21.3587 20.8706 21.675 20.6879 21.8462 20.3915C22.0172 20.0951 22.0172 19.7299 21.8462 19.4335C21.675 19.1371 21.3587 18.9545 21.0165 18.9545H21.0164ZM15.474 21.5937C15.0281 21.5967 14.5993 21.4218 14.2825 21.108C13.9656 20.7943 13.7865 20.3674 13.7848 19.9213C13.7832 19.4754 13.9592 19.0472 14.2736 18.7311C14.5882 18.415 15.0157 18.2372 15.4616 18.2366C15.9075 18.2363 16.3353 18.4132 16.6507 18.7286C16.9659 19.0439 17.1426 19.4719 17.1421 19.9178C17.1393 20.3599 16.9627 20.7831 16.6507 21.0961C16.3386 21.4092 15.9159 21.5869 15.4739 21.5911L15.474 21.5937Z"
            fill="black"
          />
        </svg>
        <h5>Filters & Sort</h5>
      </button>

      <hr className="my-6 w-full" />

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="z-9 relative" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity backdrop:selection:bg-opacity-0" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed bottom-0 left-0 top-32 flex max-w-full pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300 sm:duration-500"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300 sm:duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Filters
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {children}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
