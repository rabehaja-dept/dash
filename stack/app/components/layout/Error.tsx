import { Button } from "../interactive";

export type ErrorProps = {
  title: string;
  errorText: string;
  image?: React.ReactNode;
  code?: string;
};

export const Error = ({ title, errorText, image, code }: ErrorProps) => {
  if (image) {
    return (
      <section className="grid grid-cols-2 gap-8">
        <div className="col-span-2 flex flex-col items-start justify-center first:md:col-span-1">
          <h1 className="text-headline-md font-light">{title}</h1>
          <p className="mb-6 mt-2 text-body-md font-light">{errorText}</p>
          <Button variant="primary" className="w-full md:w-auto">
            Go to Homepage
          </Button>
        </div>
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center justify-center">{image}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center">
      <h1 className="text-headline-md font-light">{title}</h1>
      {code && <h2>{`Code: ${code}`}</h2>}
      <p className="mb-6 mt-2 text-body-md font-light">{errorText}</p>
      <Button variant="primary" className="w-full md:w-auto" to="/">
        Go to Homepage
      </Button>
    </section>
  );
};
