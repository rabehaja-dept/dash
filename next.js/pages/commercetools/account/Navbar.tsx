import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./navbar.module.css";

export default function AccountNavbar() {
  const router = useRouter();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/commercetools/auth/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));
  }, []);

  const currentPath = router.asPath;

  const accountLinks = [
    { label: "My Account", url: "/commercetools/account" },
    { label: "Order History", url: "/commercetools/account/order-history" },
    {
      label: "Billing Information",
      url: "/commercetools/account/billing-information",
    },
  ];

  const logout = () => {
    if (csrfToken) {
      fetch("/api/commercetools/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csrfToken }),
      }).then(() => {
        router.push("/");
      });
    }
  };

  return (
    <nav className={styles.accountNavContainer}>
      <div className={styles.linkContainer}>
        {accountLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className={`${styles.accountNavLink} ${
              currentPath.includes(link.url) ? styles.accountNavLinkActive : ""
            }`}
          >
            {link.label}
          </a>
        ))}

        <button className={styles.accountNavButton} onClick={logout}>
          Log out
        </button>
      </div>
    </nav>
  );
}
