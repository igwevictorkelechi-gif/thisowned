import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto px-5 pb-6 pt-16 sm:px-10 lg:px-40">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex justify-center sm:justify-start">
            <Image
              src="/thisowned-logo.png"
              width={100}
              height={100}
              style={{ width: "13rem", height: "auto" }}
              alt="logo"
            />
          </div>

          <p className="mt-4 text-center leading-relaxed text-gray-500 sm:text-left lg:mt-0 uppercase">
            {/* Shop the latest trends and enjoy exclusive deals, all in one place. */}
            JUST BE GETTING THE ONLY TRENDS AND ENJOYING EXCLUSIVE ITEMS, ALL IN ONE PLACE?
          </p>
        </div>

        <div className="mt-16 gap-8 border-t border-gray-100 pt-16">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex gap-36">
              <ul className="space-y-3 text-base">
                <li>
                  <Link
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="/../about"
                  >
                    ABOUT US
                  </Link>
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
                    href="/../about"
                  >
                    CONTACT US
                  </a>
                </li>
              </ul>
              <ul className="space-y-3 text-base">
                <li>
                  <Link
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="/../policies"
                  >
                    DELIVERY
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="/../policies"
                  >
                    PRIVACY POLICY
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-800 transition hover:text-gray-700/75"
                    href="/../policies"
                  >
                    TERMS OF SERVICE
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-14 md:mt-0">
              <p className="text-lg font-semibold text-gray-900">
                {/* Stay in Touch */}
                STAY TAPPED IN WITH THE MOB
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

          <ul className="mt-6 flex items-center justify-center gap-8 sm:mt-0 sm:justify-start">
            <li>
              <a
                href="https://www.instagram.com/thisowned?igsh=c3kyMG5lMXh4dzhw"
                rel="noreferrer"
                target="_blank"
                className="text-gray-800 transition hover:text-gray-700/75"
              >
                <Instagram />
              </a>
            </li>

            {/* <li>
              <a
                href="#"
                rel="noreferrer"
                target="_blank"
                className="text-gray-800 transition hover:text-gray-700/75"
              >
                <Facebook />
              </a>
            </li> */}

            <li>
              <a
                href="https://m.youtube.com/channel/UCJuz4UuoUIZIQx17saxl20w"
                rel="noreferrer"
                target="_blank"
                className="text-gray-800 transition hover:text-gray-700/75"
              >
                <Youtube />
              </a>
            </li>

            <li>
              <a
                href="https://www.tiktok.com/@thisownedmob?_t=8s4VGS8Muov&_r=1"
                rel="noreferrer"
                target="_blank"
                className="text-gray-800 transition hover:text-gray-700/75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="28"
                  height="28"
                  viewBox="0 0 50 50"
                >
                  <path d="M 9 4 C 6.2495759 4 4 6.2495759 4 9 L 4 41 C 4 43.750424 6.2495759 46 9 46 L 41 46 C 43.750424 46 46 43.750424 46 41 L 46 9 C 46 6.2495759 43.750424 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.671576 6 44 7.3284241 44 9 L 44 41 C 44 42.671576 42.671576 44 41 44 L 9 44 C 7.3284241 44 6 42.671576 6 41 L 6 9 C 6 7.3284241 7.3284241 6 9 6 z M 26.042969 10 A 1.0001 1.0001 0 0 0 25.042969 10.998047 C 25.042969 10.998047 25.031984 15.873262 25.021484 20.759766 C 25.016184 23.203017 25.009799 25.64879 25.005859 27.490234 C 25.001922 29.331679 25 30.496833 25 30.59375 C 25 32.409009 23.351421 33.892578 21.472656 33.892578 C 19.608867 33.892578 18.121094 32.402853 18.121094 30.539062 C 18.121094 28.675273 19.608867 27.1875 21.472656 27.1875 C 21.535796 27.1875 21.663054 27.208245 21.880859 27.234375 A 1.0001 1.0001 0 0 0 23 26.240234 L 23 22.039062 A 1.0001 1.0001 0 0 0 22.0625 21.041016 C 21.906673 21.031216 21.710581 21.011719 21.472656 21.011719 C 16.223131 21.011719 11.945313 25.289537 11.945312 30.539062 C 11.945312 35.788589 16.223131 40.066406 21.472656 40.066406 C 26.72204 40.066409 31 35.788588 31 30.539062 L 31 21.490234 C 32.454611 22.653646 34.267517 23.390625 36.269531 23.390625 C 36.542588 23.390625 36.802305 23.374442 37.050781 23.351562 A 1.0001 1.0001 0 0 0 37.958984 22.355469 L 37.958984 17.685547 A 1.0001 1.0001 0 0 0 37.03125 16.6875 C 33.886609 16.461891 31.379838 14.012216 31.052734 10.896484 A 1.0001 1.0001 0 0 0 30.058594 10 L 26.042969 10 z M 27.041016 12 L 29.322266 12 C 30.049047 15.2987 32.626734 17.814404 35.958984 18.445312 L 35.958984 21.310547 C 33.820114 21.201935 31.941489 20.134948 30.835938 18.453125 A 1.0001 1.0001 0 0 0 29 19.003906 L 29 30.539062 C 29 34.707538 25.641273 38.066406 21.472656 38.066406 C 17.304181 38.066406 13.945312 34.707538 13.945312 30.539062 C 13.945312 26.538539 17.066083 23.363182 21 23.107422 L 21 25.283203 C 18.286416 25.535721 16.121094 27.762246 16.121094 30.539062 C 16.121094 33.483274 18.528445 35.892578 21.472656 35.892578 C 24.401892 35.892578 27 33.586491 27 30.59375 C 27 30.64267 27.001859 29.335571 27.005859 27.494141 C 27.009759 25.65271 27.016224 23.20692 27.021484 20.763672 C 27.030884 16.376775 27.039186 12.849206 27.041016 12 z"></path>
                </svg>
              </a>
            </li>

            <li>
              <a
                href="https://pin.it/1j1u0y4G8"
                rel="noreferrer"
                target="_blank"
                className="text-gray-800 transition hover:text-gray-700/75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="28"
                  height="28"
                  viewBox="0 0 50 50"
                >
                  <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609825 4 46 13.390175 46 25 C 46 36.609825 36.609825 46 25 46 C 22.876355 46 20.82771 45.682142 18.896484 45.097656 C 19.75673 43.659418 20.867347 41.60359 21.308594 39.90625 C 21.570728 38.899887 22.648438 34.794922 22.648438 34.794922 C 23.348841 36.132057 25.395277 37.263672 27.574219 37.263672 C 34.058123 37.263672 38.732422 31.300682 38.732422 23.890625 C 38.732422 16.78653 32.935409 11.472656 25.476562 11.472656 C 16.196831 11.472656 11.271484 17.700825 11.271484 24.482422 C 11.271484 27.636307 12.94892 31.562193 15.634766 32.8125 C 16.041611 33.001865 16.260073 32.919834 16.353516 32.525391 C 16.425459 32.226044 16.788267 30.766792 16.951172 30.087891 C 17.003269 29.871239 16.978043 29.68405 16.802734 29.470703 C 15.913793 28.392399 15.201172 26.4118 15.201172 24.564453 C 15.201172 19.822048 18.791452 15.232422 24.908203 15.232422 C 30.18976 15.232422 33.888672 18.832872 33.888672 23.980469 C 33.888672 29.796219 30.95207 33.826172 27.130859 33.826172 C 25.020554 33.826172 23.440361 32.080359 23.947266 29.939453 C 24.555054 27.38426 25.728516 24.626944 25.728516 22.78125 C 25.728516 21.130713 24.842754 19.753906 23.007812 19.753906 C 20.850369 19.753906 19.117188 21.984457 19.117188 24.974609 C 19.117187 26.877359 19.761719 28.166016 19.761719 28.166016 C 19.761719 28.166016 17.630543 37.176514 17.240234 38.853516 C 16.849091 40.52931 16.953851 42.786365 17.115234 44.466797 C 9.421139 41.352465 4 33.819328 4 25 C 4 13.390175 13.390175 4 25 4 z"></path>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
