import { Cloudinary, Transformation } from "@cloudinary/url-gen";
import {
  AdvancedImage,
  AdvancedVideo,
  lazyload,
  placeholder,
  responsive,
} from "@cloudinary/react";
import { LoaderFunction } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { Hero } from "~/components/layout/Hero";
import { GalleryGrid } from "~/components/media/GalleryGrid";

export interface LoaderData {
  cloudName: string;
}

export const loader: LoaderFunction = async () => {
  return { cloudName: process.env.CLOUDINARY_CLOUD_NAME };
};

export default function CloudinaryApp() {
  const data = useLoaderData<LoaderData>();
  const cld = new Cloudinary({
    cloud: {
      cloudName: data.cloudName,
    },
  });
  const sampleImage = cld.image("sample");
  const sampleImage2 = cld.image("cld-sample");
  const sampleImage3 = cld.image("cld-sample-2");
  const video = cld
    .video("dash-demo/demo_video")
    .addTransformation(
      new Transformation().addTransformation("q_auto/f_auto/w_1.5")
    );
  const remoteImage = cld
    .image(
      "https://images.ctfassets.net/jcdjo56lmw8q/3nM5NslPwNqE2vFbjIniCk/9fa93ee39f580d977f0170f7b5bd93e3/sky.jpg"
    )
    .setDeliveryType("fetch")
    .addTransformation(
      new Transformation().addTransformation("r_100/q_auto/f_auto")
    );
  return (
    <>
      <section className="relative">
        <Hero
          background={{
            imageProps: {
              src: "../heroBackground.webp",
              alt: "Abstract orange background",
            },
          }}
          size="small"
          title="Cloudinary Example"
        />
        <div className="mx-4 md:mx-auto md:w-3/4">
          <h1 className="my-12 text-title-md">Responsive images</h1>
          <p className="mb-8 text-left text-lg lg:mb-12 lg:text-xl">
            The <code>responsive()</code> plugin will automatically generate
            responsive images for you.
          </p>
          <p className="mb-8 text-left text-lg lg:mb-12 lg:text-xl">
            You can resize the browser window to see the image change.
          </p>
          <p className="mb-8 text-left text-lg lg:mb-12 lg:text-xl">
            For more information about image transformations with cloudinary go
            to &nbsp;
            <Link
              className="text-primary underline hover:text-primary-weak"
              to="https://cloudinary.com/documentation/react_image_transformations"
            >
              Cloudinary image transformations
            </Link>
          </p>
          <GalleryGrid>
            <AdvancedImage
              cldImg={sampleImage}
              style={{ maxWidth: "100%" }}
              plugins={[responsive(), placeholder()]}
            />
            <AdvancedImage
              cldImg={sampleImage2}
              style={{ maxWidth: "100%" }}
              plugins={[responsive(), placeholder()]}
            />
            <AdvancedImage
              cldImg={sampleImage3}
              style={{ maxWidth: "100%" }}
              plugins={[responsive(), placeholder()]}
            />
          </GalleryGrid>
        </div>
        <div className="mx-4 md:mx-auto md:w-3/4">
          <h1 className="my-12 text-title-md">Delivery remote media files</h1>
          <p className="mb-8 text-left text-lg lg:mb-12 lg:text-xl">
            You can also deliver remote media files with cloudinary and
            transform them in the fly.
          </p>
          <p className="mb-8 text-left text-lg lg:mb-12 lg:text-xl">
            For more information about image transformations with cloudinary go
            to &nbsp;
            <Link
              className="text-primary underline hover:text-primary-weak"
              to="https://cloudinary.com/documentation/fetch_remote_images"
            >
              Fetch remote images
            </Link>
          </p>
          <AdvancedImage cldImg={remoteImage} />
        </div>
      </section>
      <section className="relative">
        <div className="md:mx-auto md:w-3/4">
          <h1 className="my-12 text-title-md">Videos</h1>
          <p className="mb-8 text-left text-lg lg:mb-12 lg:text-xl">
            There many transformations that you can apply to your videos, in the
            example above we have used the <code>lazyload()</code> plugin to
            lazy load the video.
          </p>
          <p className="mb-8 text-left text-lg lg:mb-12 lg:text-xl">
            There's also the <code>placeholder()</code> plugin and the quality
            is set as 'auto' to get the optimal balance between file size and
            visual quality. Check for more video transformations at &nbsp;
            <Link
              className="text-primary underline hover:text-primary-weak"
              to="https://cloudinary.com/documentation/react_video_transformations"
            >
              Cloudinary video transformations
            </Link>
          </p>
          <p className="mb-8 text-left text-lg lg:mb-12 lg:text-xl">
            Besides video transformations, cloudinary has it's own customizable
            video player too. For more information go to &nbsp;
            <Link
              className="text-primary underline hover:text-primary-weak"
              to="https://cloudinary.com/developers"
            >
              Developers cloudinary site
            </Link>
          </p>
          <AdvancedVideo
            cldVid={video}
            controls
            plugins={[lazyload(), placeholder()]}
            poster="https://images.ctfassets.net/mfhcn2x3bqxh/7nFMij6QBeWaaEOOJVbN3W/c29adbd05d058cb553ac6ace8e01a2c0/cover.png?fm=webp"
          />
        </div>
      </section>
    </>
  );
}
