import { CheckCircle } from "lucide-react";
import Link from "next/link";

function page() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-ink">
      <div className="section-x flex flex-col items-center text-center text-white">
        <div className="flex size-24 items-center justify-center rounded-full border border-primary bg-primary/10">
          <CheckCircle size={48} className="text-primary" />
        </div>
        <p className="eyebrow mt-8 text-primary">Order Confirmed</p>
        <h1 className="display mt-3 text-5xl sm:text-7xl">You Own It.</h1>
        <p className="mt-4 max-w-md text-sm uppercase tracking-wide text-smoke">
          Your order has been placed successfully. We&apos;ll get it moving.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/orders" className="btn-primary">
            View Order
          </Link>
          <Link href="/shop" className="btn-outline">
            Keep Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default page;
