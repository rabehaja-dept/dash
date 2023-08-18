import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import {
  ProductProjection,
  ProductVariant,
  Attribute,
} from "@deptdash/commercetools";
import { motion } from "framer-motion";
import styles from "./productVariants.module.css";

const buttonVariants = {
  hover: {
    scale: 1.1,
  },
};

export type ProductVariantsProps = {
  product: ProductProjection;
  locale: string;
  activeVariant: ProductVariant | undefined;
  setActiveVariant: Dispatch<SetStateAction<ProductVariant | undefined>>;
};

const getProductAttributes = (
  attributeList: Attribute[] | undefined,
  locale: string,
  initialValue?: {
    [key: string]: any[];
  }
) => {
  let attributes: {
    [key: string]: any[];
  } = initialValue || {};

  attributeList?.forEach((attribute) => {
    const value = attribute.value[locale];
    const name = attribute.name;

    if (
      attributes[name] &&
      attributes[name].findIndex((attributeValue) => attributeValue === value) >
        -1
    ) {
      return;
    }

    attributes = {
      ...attributes,
      [name]: attributes[name] ? [...attributes[name], value] : [value],
    };
  });

  return attributes;
};

export const ProductVariants = ({
  product,
  locale,
  activeVariant,
  setActiveVariant,
}: ProductVariantsProps) => {
  const [attributeSelection, setAttributeSelection] = useState<{
    [key: string]: any[];
  }>({});
  const availableAttributes = useMemo(() => {
    return {
      ...product.variants.reduce(
        (prev, variant) => {
          return {
            ...prev,
            ...getProductAttributes(variant.attributes, locale, prev),
          };
        },
        {
          ...getProductAttributes(product.masterVariant.attributes, locale),
        }
      ),
    };
  }, [product, locale]);

  useEffect(() => {
    return setAttributeSelection(
      getProductAttributes(product.masterVariant?.attributes, locale)
    );
  }, [product, locale]);

  useEffect(() => {
    const masterMatch = product.masterVariant.attributes?.map(
      (masterAttribute) =>
        attributeSelection[masterAttribute.name]?.[0] ===
        masterAttribute.value[locale]
    );

    const variantsMatch = product.variants.map((variant) => ({
      variant,
      match: variant.attributes?.map(
        (variantAttribute) =>
          attributeSelection[variantAttribute.name]?.[0] ===
          variantAttribute.value[locale]
      ),
    }));

    if (typeof masterMatch?.find((test) => !test) === "undefined") {
      setActiveVariant(product.masterVariant);
    } else {
      const matchedVariant = variantsMatch.find(
        (variant) =>
          variant.match &&
          typeof variant.match.find((test) => !test) === "undefined"
      );

      if (matchedVariant) {
        setActiveVariant(matchedVariant.variant);
      } else {
        setActiveVariant(undefined);
      }
    }
  }, [product, attributeSelection, locale, setActiveVariant]);

  return (
    <>
      {product.productType.obj?.attributes?.map((attribute) => {
        return (
          <div key={attribute.name} className={styles.container}>
            <h3 className={styles.attributeName}>{attribute.label[locale]}</h3>
            <div className={styles.valuesContainer}>
              {availableAttributes[attribute.name]?.map((value, index) => {
                const isSelected =
                  attributeSelection[attribute.name]?.[0] === value;
                return (
                  <motion.button
                    disabled={isSelected}
                    key={index}
                    onClick={() =>
                      setAttributeSelection((state) => ({
                        ...state,
                        [attribute.name]: [value],
                      }))
                    }
                    className={
                      isSelected ? styles.valueButtonActive : styles.valueButton
                    }
                    whileHover="hover"
                    variants={buttonVariants}
                  >
                    <span>{value}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};
