import { CheckCircle } from "lucide-react";
import Link from "next/link";

function page() {
  return (
    <div className="bg-black">
      <div className="flex flex-col items-center text-center justify-center py-16 text-white">
        <CheckCircle size={55} />

        <p className="text-gray-100 text-2xl md:text-3xl font-semibold my-8">
          Order Placed Successfully
        </p>

        <Link
          href="orders"
          className="block rounded bg-gray-100 text-center py-3 px-10 text-sm text-red-600 font-semibold transition hover:bg-gray-200 mt-2"
        >
          View Order
        </Link>
      </div>
    </div>
  );
}

export default page;
