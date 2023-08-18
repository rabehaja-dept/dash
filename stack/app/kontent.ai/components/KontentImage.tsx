export type KontentImageProps = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

/**
 * @see https://kontent.ai/learn/reference/image-transformation/
 */
export const KontentImage = ({
  url,
  alt,
  width,
  height,
  className,
}: KontentImageProps) => {
  const queryParams = new URLSearchParams({
    w: `${width}`,
    h: `${height}`,
    fit: "crop",
    fm: "webp",
    auto: "auto=format",
  });

  const urlWithParams = `${url}?${queryParams}`;

  return (
    <img
      src={urlWithParams}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};
