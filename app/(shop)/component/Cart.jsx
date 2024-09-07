import { ChevronLeft, ChevronRight, Minus, Plus, Trash2 } from "lucide-react";
import React from "react";

function Cart() {
  return (
    <div>
      <section>
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mt-8">
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
                    alt=""
                    className="size-16 rounded object-cover"
                  />

                  <div>
                    <h3 className="text-sm text-gray-100">Basic Tee 6-Pack</h3>

                    <dl className="mt-0.5 space-y-1 text-[11.2px] text-gray-100">
                      <div className="flex gap-3">
                        <dt className="inline">Size:</dt>
                        <dd className="inline">XXS</dd>
                      </div>

                      <div className="flex gap-3">
                        <dt className="inline">Price:</dt>
                        <dd className="inline">₦106.00</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-1 items-center justify-end gap-4 md:gap-5">
                    <form className="flex flex-row gap-2">
                      <button className="text-white flex items-center justify-between">
                        <Minus size={14} />
                      </button>

                      <label htmlFor="Line1Qty" className="sr-only">
                        {" "}
                        Quantity{" "}
                      </label>

                      <input
                        type="number"
                        min="1"
                        value="1"
                        id="Line1Qty"
                        readOnly
                        className="h-7 w-8 md:w-10 rounded border border-gray-200 bg-black p-0 text-center text-xs text-gray-100 
                        focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      <button className="text-white flex items-center justify-between">
                        <Plus size={14} />
                      </button>
                    </form>

                    <button className="text-gray-100 transition hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              </ul>

              <div className="mt-8 flex justify-end border-t border-gray-400 pt-8">
                <div className="w-screen max-w-lg space-y-4">
                  <dl className="space-y-0.5 text-sm text-gray-100">
                    <div className="flex justify-between">
                      <dt>Discount</dt>
                      <dd>-₦40.00</dd>
                    </div>

                    <div className="flex justify-between !text-base font-medium">
                      <dt>Total</dt>
                      <dd>₦200.00</dd>
                    </div>
                  </dl>

                  <div className="flex justify-end">
                    <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-2.5 py-0.5 text-red-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="-ms-1 me-1.5 size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                        />
                      </svg>

                      <p className="whitespace-nowrap text-xs">
                        2 Discounts Applied
                      </p>
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button className="block rounded bg-white px-10 py-2.5 text-sm text-gray-800 transition hover:bg-gray-100">
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;
