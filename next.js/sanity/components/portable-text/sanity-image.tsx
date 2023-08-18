import { useNextSanityImage, UseNextSanityImageProps } from "next-sanity-image";
import Image from "next/image";
import { client } from "~/sanity/lib/client";

export const SanityImage = ({ alt, caption, asset }) => {
  const configuredSanityClient = client(process.env.SANITY_API_READ_TOKEN);
  const imageProps: UseNextSanityImageProps = useNextSanityImage(
    configuredSanityClient,
    asset
  );

  if (!imageProps) return null;

  return <Image {...imageProps} alt={alt} title={caption} />;
};
