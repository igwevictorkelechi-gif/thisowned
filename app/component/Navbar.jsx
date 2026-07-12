"use client";
import { Search, ShoppingBasket, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { navLinks } from "../constants/ContentConstants";
import { useAuth } from "../utils/AuthContext";
import { useCart } from "../utils/CartContext";
import Swal from "sweetalert2";
import { useCurrency } from "../utils/CurrencyContext";

const TICKER = [
  "FREE SHIPPING ON ORDERS OVER $150",
  "NEW DROPS EVERY WEEK",
  "KNOW THYSELF",
  "SECURE CHECKOUT · FLUTTERWAVE & PAYSTACK",
  "LIMITED STOCK — DON'T SLEEP",
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [collections, setCollections] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { cartCount, updateCart } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsChecked(!isChecked);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsChecked(!isChecked);
  };

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    closeMenu();
    await updateCart();
    Swal.fire({
      title: "Success!",
      text: "Logout successful",
      icon: "success",
      confirmButtonColor: "#e02e21",
      confirmButtonText: "Close",
    });
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_COLLECTION_URL)
      .then((response) => response.json())
      .then((data) => setCollections(data))
      .catch((error) => console.error("Error fetching collections:", error));

    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      setIsLoggedIn(!!accessToken);
    };
    checkLoginStatus();
  }, [setIsLoggedIn]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { currency, updateCurrency } = useCurrency();
  const handleCurrencyChange = (e) => updateCurrency(e.target.value);

  const CurrencySelect = ({ className }) => (
    <select
      name="currency"
      aria-label="Select currency"
      className={`cursor-pointer border border-line bg-surface2 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-white outline-none focus:border-primary ${className}`}
      onChange={handleCurrencyChange}
      value={currency}
    >
      <option disabled value="">
        Currency
      </option>
      <option value="USD">USD</option>
      <option value="NGN">NGN</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
    </select>
  );

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement marquee bar */}
      <div className="overflow-hidden border-b border-line bg-primary py-1.5">
        <div className="animate-marquee marquee-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span
              key={i}
              className="mx-6 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-white"
            >
              {t} <span className="mx-2 text-white/70">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`border-b border-line bg-ink/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-lg shadow-black/40" : ""
        }`}
      >
        <div className="section-x">
          <div className="flex h-16 items-center justify-between md:h-[4.5rem]">
            {/* Left: mobile menu + logo */}
            <div className="flex items-center gap-3">
              <button
                className="hamburger -ml-1 mt-1 md:hidden"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <input type="checkbox" checked={isChecked} readOnly />
                <svg viewBox="0 0 32 32">
                  <path
                    className="line line-top-bottom"
                    d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                  ></path>
                  <path className="line" d="M7 16 27 16"></path>
                </svg>
              </button>

              <Link href="/" className="block">
                <Image
                  src="/logo.png"
                  width={140}
                  height={52}
                  style={{ width: "8rem", height: "2.6rem", objectFit: "contain" }}
                  alt="Thisowned"
                  priority
                />
              </Link>
            </div>

            {/* Center: desktop nav */}
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-9 text-sm font-bold uppercase tracking-widest">
                <li>
                  <Link className="text-white/80 transition hover:text-primary" href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="text-white/80 transition hover:text-primary" href="/shop">
                    Shop
                  </Link>
                </li>
                <li className="group relative">
                  <span className="cursor-pointer text-white/80 transition group-hover:text-primary">
                    Collections
                  </span>
                  <ul className="invisible absolute left-1/2 top-full z-10 w-52 -translate-x-1/2 border border-line bg-surface pt-2 opacity-0 shadow-xl shadow-black/50 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <li>
                      <Link
                        href="/shop/collection/all"
                        className="block px-4 py-2 text-xs tracking-widest text-white/80 transition hover:bg-surface2 hover:text-primary"
                      >
                        All
                      </Link>
                    </li>
                    {collections.length > 0 &&
                      collections.map((collection) => (
                        <li key={collection.id}>
                          <Link
                            href={`/shop/collection/${collection.id}`}
                            className="block px-4 py-2 text-xs tracking-widest text-white/80 transition hover:bg-surface2 hover:text-primary"
                          >
                            {collection.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>
                {isLoggedIn && (
                  <li>
                    <Link className="text-white/80 transition hover:text-primary" href="/orders">
                      Orders
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-3 md:gap-5">
              <CurrencySelect className="hidden sm:block" />

              <Link href="/shop" aria-label="Search" className="hidden text-white transition hover:text-primary md:block">
                <Search className="size-5" />
              </Link>

              <Link
                href={isLoggedIn ? "/" : "/login"}
                onClick={isLoggedIn ? handleLogout : undefined}
                className="hidden items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white transition hover:text-primary md:flex"
              >
                <User className="size-5" />
                {isLoggedIn ? "Logout" : "Login"}
              </Link>

              <Link href="/cart" aria-label="Cart" className="relative text-white transition hover:text-primary">
                <ShoppingBasket className="size-6" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex min-w-[1.1rem] items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 top-0 z-50 w-[82%] max-w-sm transform border-r border-line bg-ink transition-transform duration-300 ease-out md:hidden`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="display text-2xl text-white">Menu</span>
          <button onClick={closeMenu} aria-label="Close menu" className="text-2xl text-white/70 hover:text-primary">
            ✕
          </button>
        </div>
        <ul className="flex flex-col divide-y divide-line px-5 text-sm font-bold uppercase tracking-widest">
          {navLinks.map((nav) => (
            <li key={nav.id}>
              <Link href={`/${nav.id}`} className="block py-4 text-white/90 hover:text-primary" onClick={closeMenu}>
                {nav.title}
              </Link>
            </li>
          ))}
          <li>
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between py-4 text-white/90">
                Collections
                <span className="text-primary transition group-open:rotate-45">+</span>
              </summary>
              <div className="flex flex-col gap-2 pb-4 pl-3 text-xs text-white/70">
                <Link href="/shop/collection/all" onClick={closeMenu} className="hover:text-primary">
                  All
                </Link>
                {collections.length > 0 &&
                  collections.map((c) => (
                    <Link key={c.id} href={`/shop/collection/${c.id}`} onClick={closeMenu} className="hover:text-primary">
                      {c.name}
                    </Link>
                  ))}
              </div>
            </details>
          </li>
          {isLoggedIn && (
            <li>
              <Link href="/orders" className="block py-4 text-white/90 hover:text-primary" onClick={closeMenu}>
                Orders
              </Link>
            </li>
          )}
          <li>
            <Link
              href={isLoggedIn ? "/" : "/login"}
              className="block py-4 text-white/90 hover:text-primary"
              onClick={isLoggedIn ? handleLogout : closeMenu}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Link>
          </li>
          <li className="py-4">
            <CurrencySelect className="w-full" />
          </li>
        </ul>
      </div>

      {/* Drawer scrim */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={closeMenu} aria-hidden="true" />
      )}
    </header>
  );
}

export default Navbar;
