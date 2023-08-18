import { Dialog, Transition, Listbox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { GlobeAmericasIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

import { supportedLanguages } from "~/i18n-config";
import { useTranslation } from "react-i18next";

const languages = supportedLanguages;

/**
 * This component initially renders a button that opens a modal when clicked.
 * When the modal is open, it renders a list of languages that comes from
 * `supportedLanguages` in the i18n configuration file.
 */
export function LanguageSelector() {
  const { i18n, t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(
    languages.find((l) => l.code === i18n.language) || languages[0]
  );

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const refreshPage = () => {
    window.location.reload();
  };
  const closeAndSelectLanguage = (language: string) => {
    i18n.changeLanguage(language);
    document.cookie = `lng=${language};path=/;max-age=604800`;
    // refresh page
    refreshPage();
    closeModal();
  };

  return (
    <>
      <div>
        <Button
          variant="tertiary"
          onClick={openModal}
          className="m-4 rounded-full"
          ariaLabel="Language Selector"
          icon={<GlobeAmericasIcon className="m-1 h-6 w-6 text-grey-dark-2" />}
        />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3">{t("Change Language")}</Dialog.Title>
                  <div className="mt-4">
                    <Listbox value={selected} onChange={setSelected}>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-sm border bg-white py-2 pl-3 pr-10 text-left outline outline-1 outline-black focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                          <span className="block truncate">
                            {selected.name}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-grey-dark-1"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="z-11 absolute mt-1 max-h-60 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {languages.map((language, i) => (
                              <Listbox.Option
                                key={i}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-primary-50 text-primary"
                                      : "text-text-black"
                                  }`
                                }
                                value={language}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {language.name}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-weak">
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="primary"
                      className="px-4 py-3"
                      onClick={() => closeAndSelectLanguage(selected.code)}
                    >
                      {t("Okay") || ""}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
