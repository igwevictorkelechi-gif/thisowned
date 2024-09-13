import React from "react";

function page() {
  return (
    <div className="mx-auto bg-black">
      <header className="text-center pt-10 pb-2">
        <h2 className="text-xl font-bold text-white sm:text-3xl tracking-wider">
          Checkout
        </h2>
      </header>

      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 ">
            <div className="rounded-lg shadow-lg lg:p-12">
              <form action="#" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full">
                    <label className="sr-only" htmlFor="firstname">
                      First Name
                    </label>
                    <input
                      className="w-full rounded-lg bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="First Name"
                      type="text"
                      id="firstname"
                    />
                  </div>
                  <div className="w-full">
                    <label className="sr-only" htmlFor="lastname">
                      Last Name
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="Last Name"
                      type="text"
                      id="firstname"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full">
                    <label className="sr-only" htmlFor="email">
                      Email
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="Email address"
                      type="email"
                      id="email"
                    />
                  </div>
                  <div className="w-full">
                    <label className="sr-only" htmlFor="phone">
                      Phone
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="Phone Number"
                      type="tel"
                      id="phone"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full">
                    <label className="sr-only" htmlFor="city">
                      City
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="City"
                      type="text"
                      id="city"
                    />
                  </div>
                  <div className="w-full">
                    <label className="sr-only" htmlFor="postcode">
                      Postcode
                    </label>
                    <input
                      className="w-full rounded-md bg-black border border-gray-500 p-3 text-sm text-white"
                      placeholder="Postcode"
                      type="text"
                      id="postcode"
                    />
                  </div>
                </div>

                <div>
                  <label className="sr-only" htmlFor="message">
                    Address
                  </label>

                  <textarea
                    className="w-full rounded-md bg-black border text-white border-gray-500 p-3 text-sm"
                    placeholder="Address"
                    rows="8"
                    id="message"
                  ></textarea>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="inline-block w-full rounded-lg bg-white px-5 py-3 font-medium text-black"
                  >
                    Checkout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default page;
