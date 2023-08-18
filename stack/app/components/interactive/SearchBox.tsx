export type SearchBoxProps = {
  className?: string;
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
};

export const SearchBox = ({
  className,
  placeholder,
  onSubmit,
  onChange,
}: SearchBoxProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative bg-transparent">
        <span className="absolute inset-y-0 left-0 flex items-center px-2">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="h-6 w-6"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
        <input
          type="search"
          className="rounded-md bg-white py-2 pl-10 pr-2 text-sm"
          placeholder={placeholder}
          onChange={(e) => onChange}
          onSubmit={(e) => onSubmit}
        />
      </div>
    </div>
  );
};
