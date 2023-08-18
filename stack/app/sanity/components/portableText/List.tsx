export default function ListBlock(props: any) {
  const { children, type } = props;
  if (type === "bullet") {
    return <ul className="list-disc pl-7">{children}</ul>;
  }

  if (type === "number") {
    return <ol className="list-decimal pl-7">{children}</ol>;
  }

  return null;
}
