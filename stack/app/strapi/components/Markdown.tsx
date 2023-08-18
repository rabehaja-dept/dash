import Markdown from "markdown-to-jsx";

export type MarkdownProps = {
  children: string;
  className?: string;
};

// To customize component rendering, see https://github.com/probablyup/markdown-to-jsx#optionsoverrides---override-any-html-tags-representation

export const RenderMarkdown = ({ children, className = "" }: MarkdownProps) => {
  const options: object = {
    wrapper: "article",
    overrides: {
      h1: {
        component: "h1",
        props: {
          className: "text-2xl font-bold mb-4",
        },
      },
    },
  };

  return (
    <Markdown options={options} className={className} children={children} />
  );
};
