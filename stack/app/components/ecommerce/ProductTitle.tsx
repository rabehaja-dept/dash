import clsx from "clsx";

export type ProductTitleProps = {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  className?: string;
};

export const ProductTitle = ({
  headline,
  subheadline,
  eyebrow,
  className,
}: ProductTitleProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-start justify-center bg-background-canvas",
        className
      )}
    >
      <span className="text-title-sm font-light text-text">{eyebrow}</span>
      <h3 className="text-title-lg font-bold text-text">{headline}</h3>
      <span className="text-title-sm font-bold text-text-weak">
        {subheadline}
      </span>
    </div>
  );
};
