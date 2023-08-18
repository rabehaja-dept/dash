import type { ImgHTMLAttributes, ReactNode } from "react";

export type SectionProps = {
  className?: string;
  children: ReactNode;
  title?: string;
  subtext?: string;
  imageProps?: ImgHTMLAttributes<HTMLImageElement>;
};

export const Section = ({
  className = "",
  children,
  title,
  subtext,
  imageProps,
}: SectionProps) => {
  return (
    <section className={className}>
      {
        // eslint-disable-next-line jsx-a11y/alt-text
        imageProps && <img className="mb-10" {...imageProps} />
      }
      {title && <h1 className="mb-4 mt-4 text-center text-5xl">{title}</h1>}
      {subtext && <div className="mb-8 text-center text-2xl">{subtext}</div>}
      {children}
    </section>
  );
};
