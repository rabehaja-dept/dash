import InnerImageZoom from "react-inner-image-zoom";

export type ZoomableImageProps = {
  src: string;
  zoomSrc: string;
  alt: string;
};

/**
 * A light wrapper around react-inner-image-zoom that zooms an image on hover
 * @see https://github.com/laurenashpole/react-inner-image-zoom
 */
export const ZoomableImage = ({ src, zoomSrc, alt }: ZoomableImageProps) => (
  <InnerImageZoom
    src={src}
    zoomSrc={zoomSrc}
    zoomType={"hover"}
    imgAttributes={{ alt }}
  />
);
