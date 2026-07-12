import { Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      {/* Newsletter band */}
      <div className="border-b border-line bg-surface">
        <div className="section-x mx-auto flex max-w-7xl flex-col items-center gap-6 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <h2 className="display text-3xl sm:text-4xl">
              Stay tapped in with the mob
            </h2>
            <p className="mt-2 text-sm text-smoke">
              Be the first to know about exclusive new drops and restocks.
            </p>
          </div>
          <form className="flex w-full max-w-md">
            <label htmlFor="footer-email" className="sr-only">
              Email
            </label>
            <input
              id="footer-email"
              className="w-full border border-line bg-ink px-5 py-3.5 text-sm text-white placeholder:text-smoke focus:border-primary focus:outline-none"
              type="email"
              placeholder="ENTER YOUR EMAIL"
            />
            <button className="btn-primary shrink-0" type="submit">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Link columns */}
      <div className="section-x mx-auto max-w-7xl py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/thisowned-logo.png"
              width={180}
              height={60}
              style={{ width: "11rem", height: "auto" }}
              alt="Thisowned"
            />
            <p className="mt-4 max-w-xs text-sm uppercase tracking-wide text-smoke">
              See it. Touch it. Obtain it. The only trends, exclusive items — all
              in one place.
            </p>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-white">Shop</h3>
            <ul className="space-y-3 text-sm font-semibold uppercase tracking-wide text-smoke">
              <li>
                <Link className="transition hover:text-primary" href="/shop">
                  All Products
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-primary" href="/shop/collection/all">
                  Collections
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-primary" href="/waitlist">
                  Waitlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-white">Help</h3>
            <ul className="space-y-3 text-sm font-semibold uppercase tracking-wide text-smoke">
              <li>
                <Link className="transition hover:text-primary" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-primary" href="/about">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-primary" href="/policies">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-white">Legal</h3>
            <ul className="space-y-3 text-sm font-semibold uppercase tracking-wide text-smoke">
              <li>
                <Link className="transition hover:text-primary" href="/policies">
                  Delivery
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-primary" href="/policies">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-primary" href="/policies">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="section-x mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs uppercase tracking-widest text-smoke">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-bold text-white">Thisowned</span>. All rights
            reserved.
          </p>

          <ul className="flex items-center gap-6">
            <li>
              <a
                href="https://www.instagram.com/thisowned?igsh=c3kyMG5lMXh4dzhw"
                rel="noreferrer"
                target="_blank"
                aria-label="Instagram"
                className="text-smoke transition hover:text-primary"
              >
                <Instagram className="size-5" />
              </a>
            </li>
            <li>
              <a
                href="https://m.youtube.com/channel/UCJuz4UuoUIZIQx17saxl20w"
                rel="noreferrer"
                target="_blank"
                aria-label="YouTube"
                className="text-smoke transition hover:text-primary"
              >
                <Youtube className="size-5" />
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@thisownedmob?_t=8s4VGS8Muov&_r=1"
                rel="noreferrer"
                target="_blank"
                aria-label="TikTok"
                className="text-smoke transition hover:text-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50" fill="currentColor">
                  <path d="M 9 4 C 6.2495759 4 4 6.2495759 4 9 L 4 41 C 4 43.750424 6.2495759 46 9 46 L 41 46 C 43.750424 46 46 43.750424 46 41 L 46 9 C 46 6.2495759 43.750424 4 41 4 L 9 4 z M 26.042969 10 A 1.0001 1.0001 0 0 0 25.042969 10.998047 C 25.042969 10.998047 25.031984 15.873262 25.021484 20.759766 C 25.016184 23.203017 25.009799 25.64879 25.005859 27.490234 C 25.001922 29.331679 25 30.496833 25 30.59375 C 25 32.409009 23.351421 33.892578 21.472656 33.892578 C 19.608867 33.892578 18.121094 32.402853 18.121094 30.539062 C 18.121094 28.675273 19.608867 27.1875 21.472656 27.1875 C 21.535796 27.1875 21.663054 27.208245 21.880859 27.234375 A 1.0001 1.0001 0 0 0 23 26.240234 L 23 22.039062 A 1.0001 1.0001 0 0 0 22.0625 21.041016 C 21.906673 21.031216 21.710581 21.011719 21.472656 21.011719 C 16.223131 21.011719 11.945313 25.289537 11.945312 30.539062 C 11.945312 35.788589 16.223131 40.066406 21.472656 40.066406 C 26.72204 40.066409 31 35.788588 31 30.539062 L 31 21.490234 C 32.454611 22.653646 34.267517 23.390625 36.269531 23.390625 C 36.542588 23.390625 36.802305 23.374442 37.050781 23.351562 A 1.0001 1.0001 0 0 0 37.958984 22.355469 L 37.958984 17.685547 A 1.0001 1.0001 0 0 0 37.03125 16.6875 C 33.886609 16.461891 31.379838 14.012216 31.052734 10.896484 A 1.0001 1.0001 0 0 0 30.058594 10 L 26.042969 10 z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://pin.it/1j1u0y4G8"
                rel="noreferrer"
                target="_blank"
                aria-label="Pinterest"
                className="text-smoke transition hover:text-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50" fill="currentColor">
                  <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609825 4 46 13.390175 46 25 C 46 36.609825 36.609825 46 25 46 C 22.876355 46 20.82771 45.682142 18.896484 45.097656 C 19.75673 43.659418 20.867347 41.60359 21.308594 39.90625 C 21.570728 38.899887 22.648438 34.794922 22.648438 34.794922 C 23.348841 36.132057 25.395277 37.263672 27.574219 37.263672 C 34.058123 37.263672 38.732422 31.300682 38.732422 23.890625 C 38.732422 16.78653 32.935409 11.472656 25.476562 11.472656 C 16.196831 11.472656 11.271484 17.700825 11.271484 24.482422 C 11.271484 27.636307 12.94892 31.562193 15.634766 32.8125 C 16.041611 33.001865 16.260073 32.919834 16.353516 32.525391 C 16.425459 32.226044 16.788267 30.766792 16.951172 30.087891 C 17.003269 29.871239 16.978043 29.68405 16.802734 29.470703 C 15.913793 28.392399 15.201172 26.4118 15.201172 24.564453 C 15.201172 19.822048 18.791452 15.232422 24.908203 15.232422 C 30.18976 15.232422 33.888672 18.832872 33.888672 23.980469 C 33.888672 29.796219 30.95207 33.826172 27.130859 33.826172 C 25.020554 33.826172 23.440361 32.080359 23.947266 29.939453 C 24.555054 27.38426 25.728516 24.626944 25.728516 22.78125 C 25.728516 21.130713 24.842754 19.753906 23.007812 19.753906 C 20.850369 19.753906 19.117188 21.984457 19.117188 24.974609 C 19.117187 26.877359 19.761719 28.166016 19.761719 28.166016 C 19.761719 28.166016 17.630543 37.176514 17.240234 38.853516 C 16.849091 40.52931 16.953851 42.786365 17.115234 44.466797 C 9.421139 41.352465 4 33.819328 4 25 C 4 13.390175 13.390175 4 25 4 z" />
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
