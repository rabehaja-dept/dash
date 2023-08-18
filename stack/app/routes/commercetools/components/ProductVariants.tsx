import {
  Attribute,
  ProductProjection,
  ProductVariant,
} from "@commercetools/platform-sdk";
import React, {
  useState,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

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

export const ProductVariants: React.FC<{
  product: ProductProjection;
  locale: string;
  activeVariant: ProductVariant | undefined;
  setActiveVariant: Dispatch<SetStateAction<ProductVariant | undefined>>;
  children?: null;
}> = ({ product, locale, activeVariant, setActiveVariant }) => {
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
          <div key={attribute.name} className="mb-4">
            <h1 className="mb-2 text-sm font-medium text-black">
              {attribute.label[locale]}
            </h1>
            <div className="flex flex-wrap items-center">
              {availableAttributes[attribute.name]?.map((value, index) => {
                const isSelected =
                  attributeSelection[attribute.name]?.[0] === value;
                return (
                  <button
                    className={`${isSelected ? "border-2 border-black" : ""}`}
                    disabled={isSelected}
                    key={index}
                    onClick={() =>
                      setAttributeSelection((state) => ({
                        ...state,
                        [attribute.name]: [value],
                      }))
                    }
                  >
                    <span
                      className={`m-1 block cursor-pointer border border-black p-2 text-xs font-light ${
                        isSelected ? "bg-black text-white" : "text-black"
                      }`}
                    >
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};
