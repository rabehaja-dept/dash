import BlockContent from "@sanity/block-content-to-react";
import { Link } from "~/components/interactive/Link";
import { Block as SanityBlock } from "~/@types/sanity";
import Block from "./portableText/Block";
import ListBlock from "./portableText/List";

interface Props {
  blocks: SanityBlock[];
}
const serializers = {
  list: ListBlock,
  types: {
    block: Block,
  },
  marks: {
    link: (props: any) => {
      return <Link href={props.mark.href}>{props.children}</Link>;
    },
  },
};

export default function PortableText(props: Props) {
  const { blocks } = props;
  return (
    <div>
      <BlockContent blocks={blocks} serializers={serializers} />
    </div>
  );
}
