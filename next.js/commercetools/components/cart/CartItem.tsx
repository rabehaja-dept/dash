import { LineItem } from "@deptdash/commercetools";

interface CartType {
  data: LineItem;
  cartId: string;
  cartVersion: number;
  locale: string;
  language: string;
}

export function CartItem({ data, locale, language }: CartType) {
  const { variant } = data;

  const getLocaleValue = (value: any) => {
    return value[locale] ? value[locale] : value[language];
  };

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "5px",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <img
          width={112}
          height={112}
          alt={variant?.images?.length ? variant?.images[0]?.label : ""}
          src={variant?.images?.length ? variant?.images[0]?.url : undefined}
          style={{
            height: "128px",
            width: "128px",
            border: "1px solid",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <div>
          <div
            style={{ display: "grid", paddingBottom: "10px", fontSize: "12px" }}
          >
            {(variant.attributes || []).map((option) => (
              <div key={option.name}>
                <span style={{ marginRight: "5px", fontWeight: "bold" }}>
                  {option.name}:
                </span>
                {getLocaleValue(option.value)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}
