import { Price } from "~/components/price";
import styles from "./checkoutproducts.module.css";
import { getLanguageFromLocaleString } from "~/commercetools/utils/utils";

function CheckoutProducts({ data, locale }) {
  const language = getLanguageFromLocaleString(locale);
  const getLocaleValue = (value: any) => {
    /**
     * Localized key in response may contain only language code or
     * both language-country, so we need to get string from one of these
     */
    return value[locale] ? value[locale] : value[language];
  };
  return (
    <>
      {data?.length &&
        data.map((product) => (
          <div key={product.id} className={styles.container}>
            <div className={styles.productDetails}>
              <div className={styles.productImage}>
                <img
                  width={64}
                  height={64}
                  alt={
                    product.variant?.images?.length
                      ? product.variant?.images[0]?.label
                      : ""
                  }
                  src={
                    product.variant?.images?.length
                      ? product.variant?.images[0]?.url
                      : undefined
                  }
                  className={styles.imageStyle}
                />
                <div className={styles.quantity}>{product.quantity}</div>
              </div>
              <div className={styles.details}>
                <div className={styles.productName}>
                  {getLocaleValue(product.name)}
                </div>
                {(product.variant.attributes || []).map((option) => (
                  <div key={option.name}>
                    <span className={styles.attributeValue}>
                      {getLocaleValue(option.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.cartTotalPriceContainer}>
              <Price price={product.totalPrice} locale={locale} />
            </div>
          </div>
        ))}
    </>
  );
}

export default CheckoutProducts;
