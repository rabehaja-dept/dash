import { Link, Button } from "~/components/interactive";

const social = [
  {
    name: "facebook",
    href: "https://www.facebook.com/DeptAgency/",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        {...props}
        width="8"
        height="17"
        viewBox="0 0 8 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.314941 5.86164H1.94443V4.25893C1.85949 3.39975 2.04544 2.53552 2.47624 1.78731C2.76809 1.38645 3.15682 1.06613 3.60608 0.856285C4.05535 0.646444 4.55048 0.553936 5.0452 0.587407C6.03927 0.543927 7.03441 0.643932 7.99994 0.884341L7.59227 3.32797C7.15901 3.2079 6.71278 3.14088 6.26337 3.12839C5.62082 3.12839 5.04642 3.35839 5.04642 4.01432V5.86164H7.67745L7.49613 8.24929H5.0452V16.5367H1.94443V8.24929H0.314941V5.86164Z"
          fill="#00223E"
        />
      </svg>
    ),
  },
  {
    name: "twitter",
    href: "https://twitter.com/deptagency",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M18 1.65302C17.3263 1.93799 16.6118 2.12508 15.8804 2.20813C16.6506 1.76756 17.2267 1.07346 17.5008 0.255727C16.7766 0.667468 15.984 0.95726 15.1574 1.1125C14.6505 0.59702 13.9936 0.239032 13.2717 0.0848694C12.5498 -0.0692931 11.7962 -0.0125323 11.1084 0.247804C10.4206 0.50814 9.83031 0.960065 9.41388 1.54509C8.99745 2.13011 8.77408 2.82129 8.77269 3.52917C8.77159 3.79981 8.80344 4.06965 8.8676 4.33323C7.39894 4.26297 5.96207 3.89824 4.65007 3.26267C3.33806 2.6271 2.18017 1.73486 1.2514 0.643739C0.780498 1.42222 0.636762 2.34303 0.849372 3.21924C1.06198 4.09545 1.615 4.86139 2.39617 5.36158C1.80902 5.34405 1.23466 5.19298 0.720609 4.92086V4.96347C0.721106 5.77961 1.01658 6.57046 1.55691 7.20185C2.09723 7.83324 2.84914 8.2663 3.68507 8.42756C3.36759 8.51153 3.03957 8.55341 2.71019 8.55204C2.47197 8.55368 2.23415 8.53302 2.00013 8.49036C2.23506 9.19317 2.69411 9.80789 3.31282 10.2482C3.93153 10.6885 4.6788 10.9322 5.44968 10.9452C3.90439 12.0991 1.94713 12.6255 0 12.4109C1.58607 13.3843 3.4167 13.9311 5.29972 13.9939C7.18274 14.0567 9.0487 13.6332 10.7017 12.7678C12.3548 11.9025 13.7339 10.6271 14.6944 9.07575C15.6549 7.52436 16.1613 5.75411 16.1604 3.95083V3.47198C16.8814 2.97477 17.5042 2.35887 18 1.65302"
          fill="#00223E"
        />
      </svg>
    ),
  },
  {
    name: "instagram",
    href: "https://www.instagram.com/deptagency/",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M12.8892 0H3.11079C2.28576 0 1.49452 0.327743 0.911129 0.911129C0.327743 1.49452 0 2.28576 0 3.11079V12.8892C0 13.7142 0.327743 14.5055 0.911129 15.0889C1.49452 15.6723 2.28576 16 3.11079 16H12.8892C13.7142 16 14.5055 15.6723 15.0889 15.0889C15.6723 14.5055 16 13.7142 16 12.8892V3.11079C16 2.28576 15.6723 1.49452 15.0889 0.911129C14.5055 0.327743 13.7142 0 12.8892 0ZM13.7787 1.84443H14.1299V4.55532H11.4267V1.84443H13.7787ZM5.72042 6.36001C6.11282 5.81758 6.68602 5.43311 7.33677 5.27583C7.98751 5.11856 8.67303 5.19883 9.26984 5.50218C9.86665 5.80553 10.3355 6.31202 10.592 6.93043C10.8485 7.54883 10.8757 8.23849 10.6688 8.87519C10.4619 9.51189 10.0344 10.0538 9.46335 10.4032C8.89231 10.7527 8.21526 10.8868 7.55414 10.7813C6.89302 10.6758 6.29129 10.3377 5.85734 9.82792C5.42339 9.31812 5.18575 8.67012 5.18722 8.00064C5.18851 7.41138 5.37503 6.83744 5.72042 6.36001V6.36001ZM14.4452 12.8892C14.4465 13.0935 14.407 13.2959 14.3291 13.4847C14.2512 13.6736 14.1365 13.845 13.9916 13.989C13.8468 14.133 13.6747 14.2468 13.4854 14.3236C13.2961 14.4003 13.0935 14.4387 12.8892 14.4363H3.11079C2.90697 14.438 2.70485 14.3991 2.51617 14.322C2.32748 14.245 2.15601 14.1311 2.0117 13.9872C1.8674 13.8432 1.75314 13.672 1.67558 13.4835C1.59801 13.2951 1.55868 13.093 1.55988 12.8892V6.36001H3.94649C3.67762 7.0239 3.57594 7.74367 3.65037 8.45606C3.7248 9.16846 3.97307 9.85166 4.37336 10.4456C4.77365 11.0396 5.3137 11.5262 5.94606 11.8626C6.57842 12.199 7.28373 12.3749 8 12.3749C8.71627 12.3749 9.42158 12.199 10.0539 11.8626C10.6863 11.5262 11.2264 11.0396 11.6266 10.4456C12.0269 9.85166 12.2752 9.16846 12.3496 8.45606C12.4241 7.74367 12.3224 7.0239 12.0535 6.36001H14.4452V12.8892Z"
          fill="#00223E"
        />
      </svg>
    ),
  },
];

type LinkItem = {
  title: string;
  entries: LinkEntry[];
};

type LinkEntry = {
  name: string;
  href: string;
  external?: boolean;
};

const linkTable: LinkItem[] = [
  {
    title: "Site",
    entries: [
      { name: "Register", href: "/join" }, // @dash-remove db
      { name: "Login", href: "/login" }, // @dash-remove db
    ],
  },
  {
    title: "Shopify",
    entries: [{ name: "Shopify", href: "/shopify" }],
  },
  {
    title: "DEPT DASH™",
    entries: [
      {
        name: "Documentation",
        href: "//deptagency.github.io/dash/",
        external: true,
      },
    ],
  },
  {
    title: "Design",
    entries: [
      {
        name: "Storybook",
        href: "//deptagency.github.io/dash/storybook/",
        external: true,
      },
    ],
  },
  {
    title: "DEPT®",
    entries: [
      { name: "DEPT®", href: "//deptagency.com/", external: true },
      {
        name: "BASIC/DEPT®",
        href: "//www.basicagency.com/",
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background-accent-base">
      <div className="mx-auto px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="flex flex-1 flex-col xl:flex-row">
          <div className="flex flex-1 flex-col pb-16 sm:flex-row sm:items-center sm:justify-between xl:flex-col xl:px-16 xl:pb-0">
            <Logo />
            <div className="flex space-x-3 xl:mt-16">
              {social.map((item) => (
                <Button
                  variant="white"
                  key={item.name}
                  href={item.href}
                  as="a"
                  icon={<item.icon aria-hidden="true" />}
                  rounded
                  className="h-10 w-10"
                ></Button>
              ))}
            </div>
          </div>
          <div className="w-full lg:border-border-weak xl:border-l-2 xl:pl-24">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {linkTable.map((lt) => (
                <div key={lt.title}>
                  <h4 className="text-sm font-semibold">{lt.title}</h4>
                  <ul className="mt-4 space-y-4">
                    {lt.entries.map((item) => (
                      <li key={item.name}>
                        {item.external ? (
                          <Link
                            href={item.href}
                            variant="dark"
                            target="_blank"
                            rel="noreferrer"
                            className="text-base"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <Link
                            variant="dark"
                            to={item.href}
                            className="text-base"
                          >
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mh-20 flex items-start justify-between bg-background-accent-primary p-6 leading-8 sm:items-center">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
          <span className="">
            DEPT DASH™ © 2022 Dept Technology LLC All Rights Reserved
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              variant="dark"
              to="/terms-and-conditions"
              className="mr-2"
              underlined
            >
              <span>Terms & conditions</span>
            </Link>
            <Link variant="dark" to="/privacy-policy" underlined>
              <span>Privacy policy</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center leading-8">
          <ScrollToTop />
        </div>
      </div>
    </footer>
  );
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const ScrollToTop = () => {
  return (
    <button className="flex " onClick={scrollToTop}>
      <span className="sr-only sm:not-sr-only sm:mr-4">Back to top</span>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
      >
        <svg
          width="11"
          height="15"
          viewBox="0 0 11 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.68031 14.881H4.89331L4.89331 3.41998L1.99331 6.31998L0.730309 5.05698L5.78731 -1.81198e-05L10.8413 5.05298L9.57831 6.31598L6.67831 3.41598L6.68031 14.881Z"
            fill="#00223E"
          />
        </svg>
      </span>
    </button>
  );
};

const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="73px"
      height="20px"
      viewBox="0 0 71 20"
      fill="none"
    >
      <g fill="currentColor">
        <path d="M 18.460938 9.789062 C 18.460938 4.824219 15.785156 1 8.976562 1 L 1.699219 1 L 1.699219 18.574219 L 8.976562 18.574219 C 15.785156 18.574219 18.460938 14.75 18.460938 9.789062 Z M 13.507812 9.789062 C 13.507812 13.257812 11.578125 14.546875 8.902344 14.546875 L 6.425781 14.546875 L 6.425781 5.027344 L 8.902344 5.027344 C 11.578125 5.027344 13.507812 6.320312 13.507812 9.789062 Z M 13.507812 9.789062 "></path>
        <path d="M 19.589844 18.574219 L 33.351562 18.574219 L 33.351562 14.574219 L 24.320312 14.574219 L 24.320312 11.558594 L 32.25 11.558594 L 32.25 7.761719 L 24.320312 7.761719 L 24.320312 5.003906 L 33.125 5.003906 L 33.125 1 L 19.589844 1 Z M 19.589844 18.574219 "></path>
        <path d="M 49.363281 7.105469 C 49.363281 2.671875 46.5625 1 42.210938 1 L 34.683594 1 L 34.683594 18.574219 L 39.410156 18.574219 L 39.410156 13.207031 L 42.210938 13.207031 C 46.5625 13.207031 49.363281 11.535156 49.363281 7.105469 Z M 44.464844 7.105469 C 44.464844 8.824219 43.664062 9.535156 41.738281 9.535156 L 39.410156 9.535156 L 39.410156 4.671875 L 41.738281 4.671875 C 43.664062 4.671875 44.464844 5.382812 44.464844 7.105469 Z M 44.464844 7.105469 "></path>
        <path d="M 49.882812 5.101562 L 55.359375 5.101562 L 55.359375 18.574219 L 60.085938 18.574219 L 60.085938 5.101562 L 65.566406 5.101562 L 65.566406 1 L 49.882812 1 Z M 49.882812 5.101562 "></path>
        <path d="M 63.601562 16.113281 C 63.601562 17.703125 64.875 18.992188 66.441406 18.992188 C 68.015625 18.992188 69.300781 17.703125 69.300781 16.113281 C 69.300781 14.523438 68.015625 13.222656 66.441406 13.222656 C 64.875 13.222656 63.601562 14.523438 63.601562 16.113281 Z M 64.148438 16.113281 C 64.148438 14.800781 65.171875 13.726562 66.441406 13.726562 C 67.714844 13.726562 68.75 14.800781 68.75 16.113281 C 68.75 17.425781 67.714844 18.488281 66.441406 18.488281 C 65.171875 18.488281 64.148438 17.425781 64.148438 16.113281 Z M 65.109375 17.539062 L 66.007812 17.539062 L 66.007812 16.558594 L 66.519531 16.558594 L 67.054688 17.539062 L 68.027344 17.539062 L 67.378906 16.378906 C 67.675781 16.253906 67.902344 15.914062 67.902344 15.53125 C 67.902344 14.867188 67.476562 14.546875 66.757812 14.546875 L 65.109375 14.546875 Z M 66.992188 15.546875 C 66.992188 15.785156 66.84375 15.886719 66.558594 15.886719 L 66.007812 15.886719 L 66.007812 15.257812 L 66.558594 15.257812 C 66.84375 15.257812 66.992188 15.332031 66.992188 15.546875 Z M 66.992188 15.546875 "></path>
      </g>
    </svg>
  );
};
