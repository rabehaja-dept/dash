import {
  DomElementOptionsType,
  ResolversType,
  RichTextElement,
} from "@kontent-ai/react-components";
import { Link } from "@remix-run/react";
import {
  ElementModels,
  Elements,
  IContentItem,
  ILink,
  IRichTextImage,
} from "@kontent-ai/delivery-sdk";

interface RichTextProps {
  element: Elements.RichTextElement;
  className?: string;
}

export const RichText = ({ element, className }: RichTextProps) => {
  const resolvers: ResolversType = {
    resolveLinkedItem: (
      linkedItem: IContentItem | undefined,
      domOptions: DomElementOptionsType
    ) => {
      const contentItemType = linkedItem ? linkedItem.system.type : "";

      switch (contentItemType) {
        case "hosted_video": {
          if (
            linkedItem?.elements.videoHost.value.find(
              (item: ElementModels.MultipleChoiceOption) =>
                item.codename === "vimeo"
            )
          ) {
            return (
              <iframe
                allowFullScreen
                className="hosted-video__wrapper"
                src={`https://player.vimeo.com/video/${linkedItem.elements.videoId.value}?title=0&byline=0&portrait=0`}
                width="640"
                height="360"
                title={`Vimeo video ${linkedItem.elements.videoId.value}`}
              ></iframe>
            );
          } else if (
            linkedItem?.elements.videoHost.value.find(
              (item: ElementModels.MultipleChoiceOption) =>
                item.codename === "youtube"
            )
          ) {
            return (
              <iframe
                allowFullScreen
                className="hosted-video__wrapper"
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${linkedItem.elements.videoId.value}`}
                title={`Youtube video ${linkedItem.elements.videoId.value}`}
              ></iframe>
            );
          } else {
            return <div>Content item not supported</div>;
          }
        }
        default:
          return <div>Content item not supported</div>;
      }
    },
    resolveLink: (link: ILink, domOptions: DomElementOptionsType) => {
      return <Link to={link?.urlSlug}>{link?.urlSlug}</Link>;
    },
    resolveImage: (
      image: IRichTextImage,
      domOptions: DomElementOptionsType
    ) => {
      return (
        <img
          className="xImage"
          src={`${image.url}`}
          alt={`${image.description || `image with id: ${image.imageId}`}`}
        />
      );
    },
    resolveDomNode: ({
      domNode,
      domToReact,
    }: {
      // you may want to use a more specific type here
      domNode: any;
      domToReact: any;
    }) => {
      if (domNode.name === "h2") {
        domNode.attribs.class = "text-headline-sm";
      }
      if (domNode.name === "h3") {
        domNode.attribs.class = "text-title-lg";
      }
      if (domNode.name === "h4") {
        domNode.attribs.class = "text-title-md";
      }
      if (domNode.name === "h5") {
        domNode.attribs.class = "text-title-sm";
      }
      if (domNode.name === "p") {
        domNode.attribs.class = "my-2";
      }
      return domToReact(domNode);
    },
  };

  return (
    <div className={className}>
      <RichTextElement richTextElement={element} resolvers={resolvers} />
    </div>
  );
};
