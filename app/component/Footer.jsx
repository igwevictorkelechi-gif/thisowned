import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto px-5 pb-6 pt-16 sm:px-10 lg:px-40">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex justify-center sm:justify-start">
            <Image
              src="/logo.png"
              width={120}
              height={120}
              style={{ width: "9rem", height: "auto" }}
              alt="logo"
            />
          </div>

          <p className="mt-4 text-center leading-relaxed text-gray-500 sm:text-left lg:mt-0 uppercase">
            Shop the latest trends and enjoy exclusive deals, all in one place.
          </p>
        </div>

        <div className="mt-16 gap-8 border-t border-gray-100 pt-16">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex gap-36">
              <ul className="space-y-3 text-base">
                <li>
                  <a
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="#"
                  >
                    ABOUT US
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="#"
                  >
                    FAQs
                  </a>
                </li>

                <li>
                  <a
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="#"
                  >
                    CONTACT US
                  </a>
                </li>
              </ul>
              <ul className="space-y-3 text-base">
                <li>
                  <a
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="#"
                  >
                    DELIVERY
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="#"
                  >
                    PRIVACY POLICY
                  </a>
                </li>
                <li>
                  <a
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="#"
                  >
                    TERMS OF SERVICE
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-14 md:mt-0">
              <p className="text-lg font-semibold text-gray-900">
                Stay in Touch
              </p>

              <div className="mx-auto mt-5 max-w-md sm:ms-0">
                <p className="leading-relaxed text-gray-500">
                  Keep updated with the store and be the first to know about
                  exclusive new drops
                </p>

                <form className="mt-4">
                  <div className="flex flex-col gap-4">
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>

                    <div className="flex">
                      <input
                        className="w-full border border-gray-200 px-5 py-2.5"
                        type="email"
                        placeholder="Enter your email"
                      />

                      <button
                        className="block bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800"
                        type="submit"
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-100 pt-6 sm:flex sm:items-center sm:justify-between">
          <p className="text-center text-sm text-gray-500 sm:text-left">
            Copyright &copy; 2024.{" "}
            <span className="font-semibold">THISOWNED</span>. All rights
            reserved.
          </p>

          <ul className="mt-6 flex justify-center gap-6 sm:mt-0 sm:justify-start">
            <li>
              <a
                href="#"
                rel="noreferrer"
                target="_blank"
                className="text-gray-800 transition hover:text-gray-700/75"
              >
                <Instagram />
              </a>
            </li>

            <li>
              <a
                href="#"
                rel="noreferrer"
                target="_blank"
                className="text-gray-800 transition hover:text-gray-700/75"
              >
                <Facebook />
              </a>
            </li>

            <li>
              <a
                href="#"
                rel="noreferrer"
                target="_blank"
                className="text-gray-800 transition hover:text-gray-700/75"
              >
                <Youtube />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
