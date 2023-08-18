import { XCircleIcon } from "@heroicons/react/24/solid";

export default function CheckoutCancel() {
  return (
    <section className="mx-10 my-48">
      <div className="mx-auto flex h-24 w-24 rounded-full md:items-center md:justify-center">
        <XCircleIcon className="h-12 w-12 text-alert-error" />
      </div>
      <div className="mx-auto mb-8 flex flex-col md:items-center md:justify-center">
        <h1 className="text-title-md">Checkout Cancelled</h1>
        <p className="mb-8 text-body-md">
          This is the cancellation page for the Commercetools checkout flow.
        </p>
      </div>
    </section>
  );
}
