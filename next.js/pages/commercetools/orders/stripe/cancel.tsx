import { MdClose } from "react-icons/md";

export default function CheckoutCancel() {
  return (
    <section className="mx-10 my-48">
      <div className="mx-auto flex h-24 w-24 rounded-full md:items-center md:justify-center">
        <MdClose className="text-alert-error h-12 w-12" />
      </div>
      <div className="mx-auto mb-8 flex flex-col md:items-center md:justify-center">
        <h1 className="text-title-md">Checkout Cancelled</h1>
        <p className="text-body-md mb-8">
          This is the cancellation page for the Commercetools checkout flow.
        </p>
      </div>
    </section>
  );
}
