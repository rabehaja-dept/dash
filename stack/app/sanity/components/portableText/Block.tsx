import type { PortableTextBlock } from "@portabletext/types";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  node: PortableTextBlock;
};

export default function Block({ children, node }: Props) {
  if (node.style === "h1") {
    return (
      <h1 className="my-4 text-4xl font-bold tracking-tight">{children}</h1>
    );
  }
  if (node.style === "h2") {
    return (
      <h2 className="my-4 text-3xl font-bold tracking-tight">{children}</h2>
    );
  }
  if (node.style === "h3") {
    return (
      <h3 className="my-4 text-2xl font-bold tracking-tight">{children}</h3>
    );
  }
  if (node.style === "h4") {
    return (
      <h4 className="my-2 text-xl font-bold tracking-tight">{children}</h4>
    );
  }
  if (node.style === "h5") {
    return (
      <h5 className="my-2 text-lg font-bold tracking-tight">{children}</h5>
    );
  }
  if (node.style === "h6") {
    return (
      <h6 className="my-2 text-base font-bold tracking-tight">{children}</h6>
    );
  }
  return <p className="mb-5">{children}</p>;
}
