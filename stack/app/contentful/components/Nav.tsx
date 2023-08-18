import {
  Button,
  LanguageSelector,
  AlertBanner,
} from "~/components/interactive";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Popover } from "@headlessui/react";
import { NavLink } from "@remix-run/react";
import { Menu } from "@headlessui/react";
import { useNavContainers } from "~/contentful/components/NavProvider";
import {
  INavContainer,
  INavContainerFields,
  INavItemFields,
  SpecificLocale,
  SpecificLocaleFields,
} from "~/@types/generated/contentful";

function getLinksFromNavContainer(
  navContainer: SpecificLocale<INavContainer>,
  options?: { mobile?: boolean; menuItem?: boolean }
): React.ReactNode {
  return navContainer.fields.items.map((item) => {
    const contentType = item.sys.contentType.sys.id;
    if (contentType === "navItem") {
      const fields = item.fields as SpecificLocaleFields<INavItemFields>;
      if (options?.mobile) {
        return (
          <Popover.Button
            key={fields.label}
            as={NavLink}
            to={fields.url}
            className="m-5 block"
          >
            {fields.label}
          </Popover.Button>
        );
      } else if (options?.menuItem) {
        return (
          <Menu.Item key={fields.label} as="div" className="px-4 py-2">
            <NavLink
              to={fields.url}
              className={({ isActive }) =>
                `hover:opacity-60 ${isActive ? "font-bold" : ""}`
              }
            >
              {fields.label}
            </NavLink>
          </Menu.Item>
        );
      } else {
        return (
          <NavLink
            key={fields.label}
            to={fields.url}
            className={({ isActive }) =>
              `px-3 hover:opacity-60 ${isActive ? "font-bold" : ""}`
            }
          >
            {fields.label}
          </NavLink>
        );
      }
    } else if (contentType === "navContainer") {
      const fields = item.fields as SpecificLocaleFields<INavContainerFields>;
      if (options?.mobile) {
        return (
          <div key={fields.label} className="ml-5">
            <span>{fields.label}</span>
            {getLinksFromNavContainer(item as SpecificLocale<INavContainer>, {
              mobile: true,
            })}
          </div>
        );
      } else {
        return (
          <Menu
            key={fields.label}
            as="div"
            className="relative inline-block text-left"
          >
            <Menu.Button className="px-3 hover:opacity-60">
              {fields.label}
            </Menu.Button>
            <Menu.Items className="absolute left-0 mt-2 w-56 origin-top bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {getLinksFromNavContainer(item as SpecificLocale<INavContainer>, {
                menuItem: true,
              })}
            </Menu.Items>
          </Menu>
        );
      }
    }
    return null;
  });
}

export type NavProps = {
  sticky?: boolean;
  banner?: React.ReactNode;
  slot?: React.ReactNode; // slot to the left of the hamburger menu
  children?: React.ReactNode; // slot at the bottom of the nav bar
};

export function Nav({ sticky = false, banner, slot, children }: NavProps) {
  const { primaryNav } = useNavContainers();

  return (
    <Popover
      as="nav"
      id="nav-header"
      className={`${sticky ? "sticky top-0 z-50" : ""}`}
    >
      {banner && <AlertBanner content={banner} />}
      <div className="border-1 flex h-[80px] items-center justify-between border border-border-weak bg-white p-2 px-10">
        <div className="leading-[64px]">
          <NavLink to="/">
            <img
              src="/logo.svg"
              alt="Logo"
              className="inline-block w-[120px]"
              width="120px"
              height="33px"
            />
          </NavLink>
          <div className="inline-block align-middle">
            <LanguageSelector />
          </div>
        </div>
        <div className="flex items-center">
          <a href="#main-content" className="sr-only focus:not-sr-only">
            Skip Navigation
          </a>
          <span className="mr-10 hidden lg:inline">
            {getLinksFromNavContainer(primaryNav)}
          </span>
          <div className="hidden lg:inline-block">
            <Button to="/contact-us" aria-label="Contact">
              Contact Us
            </Button>
          </div>
          <div className="ml-4">{slot}</div>
          <Popover.Button
            className="ml-4 flex w-10 cursor-pointer items-center align-top lg:hidden"
            aria-label="Open navigation menu"
          >
            <Bars3Icon className="text-text" />
          </Popover.Button>
        </div>
      </div>

      {children}

      <Popover.Overlay className="fixed inset-0 bg-black opacity-40" />

      <Popover.Panel className="absolute left-0 right-14 top-0 z-10 h-screen bg-white">
        <Popover.Button
          className="float-right m-2 w-10 cursor-pointer"
          aria-label="Close navigation menu"
        >
          <Bars3Icon />
        </Popover.Button>
        {getLinksFromNavContainer(primaryNav, { mobile: true })}
        <Popover.Button
          as={NavLink}
          to="/contact-us"
          className="m-10 block sm:hidden"
        >
          Contact Us
        </Popover.Button>
      </Popover.Panel>
    </Popover>
  );
}
