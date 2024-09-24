import { ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="bg-black">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-14">
        <div className="flex py-10">
          <h1 className="text-2xl font-semibold flex gap-4 items-center text-white">
            {" "}
            <Link href={`../orders`}>
              <ArrowLeftCircleIcon size={22} />
            </Link>{" "}
            Delivery Information
          </h1>
        </div>
        {/* {DeliveryDetail ? ( */}
        <>
          <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
            <dl className="-my-3 divide-y divide-gray-100 text-sm">
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Full name</dt>
                <dd className="text-white sm:col-span-2">Abdulrazaq Salihu</dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Phone number</dt>
                <dd className="text-white sm:col-span-2">08085458632</dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Street</dt>
                <dd className="text-white sm:col-span-2">145 ladan street</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">City</dt>
                <dd className="text-white sm:col-span-2">Kubwa</dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Status</dt>
                <dd className="text-white sm:col-span-2">
                  {/* {DeliveryDetail.status} */}

                  {/* {DeliveryDetail.status === "cancelled" ? ( */}
                  {/* <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-white">
                    <p className="whitespace-nowrap text-sm">Cancelled</p>
                  </span> */}
                  {/* ) : DeliveryDetail.status === "confirmed" ? ( */}
                  {/* <span className="inline-flex items-center justify-center rounded-full bg-green-500 px-2 py-0.5 text-white">
                    <p className="whitespace-nowrap text-sm">Success</p>
                  </span> */}
                  {/* ) : ( */}
                  <span className="inline-flex items-center justify-center rounded-full bg-yellow-400 text-yellow-700 px-2 py-0.5">
                    <p className="whitespace-nowrap text-sm">Pending</p>
                  </span>
                  {/* )} */}
                </dd>
              </div>

              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-white">Address</dt>
                <dd className="text-white sm:col-span-2">
                  Dantata estate Kubwa, Abuja
                </dd>
              </div>
            </dl>
          </div>
        </>
        {/* ) : (
              <div className="flex items-center justify-center font-medium">
                Loading...
              </div>
            )} */}
      </div>
    </div>
  );
}

export default page;
