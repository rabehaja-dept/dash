import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useMemo, useState } from "react";
import { MurmurHash3 } from "../utils";

export type AccordionItem = {
  title: string;
  body: string;
};

type AccordionItemProps = AccordionItem & {
  index: number;
  ariaIdPrefix: string;
};

export type AccordionProps = {
  className?: string;
  title?: string;
  items: AccordionItem[];
  pretext?: string;
  // This is used to create unique IDs for aria-controls and aria-labelledby attributes
  // If it's not present, we create our own unique ID based on a hash of all props
  ariaIdPrefix?: string;
};

export const Accordion = (props: AccordionProps) => {
  const {
    className = "",
    title,
    items,
    pretext,
    ariaIdPrefix: passedAriaIdPrefix,
  } = props;
  const ariaIdPrefix = useMemo(
    () => passedAriaIdPrefix || String(MurmurHash3(JSON.stringify(props))),
    [props, passedAriaIdPrefix]
  );

  return (
    <div className={`pt-4 ${className}`}>
      {pretext && <div className="mb-3 text-center text-lg">{pretext}</div>}
      <h1 className="mb-8 text-center text-4xl lg:mb-12 lg:text-5xl">
        {title}
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {items.map((item, index) => (
          <AccordionItemComponent
            key={index}
            index={index}
            title={item.title}
            body={item.body}
            ariaIdPrefix={ariaIdPrefix}
          />
        ))}
      </div>
    </div>
  );
};

const AccordionItemComponent = ({
  title,
  body,
  index,
  ariaIdPrefix,
}: AccordionItemProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const buttonId = `${ariaIdPrefix}-accordion-button-${index}`;
  const bodyId = `${ariaIdPrefix}-accordion-item-${index}`;

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      id={buttonId}
      aria-controls={bodyId}
      aria-expanded={expanded}
      className="rounded-card flex cursor-pointer justify-between gap-6 border border-border-weak px-8 py-5 text-left"
    >
      <div>
        <div className="my-1 font-semibold">{title}</div>
        <div id={bodyId} aria-labelledby={buttonId} hidden={!expanded}>
          {body}
        </div>
      </div>
      <ChevronDownIcon
        className={`h-8 w-8 shrink-0 transition-all duration-300 ${
          expanded ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};
