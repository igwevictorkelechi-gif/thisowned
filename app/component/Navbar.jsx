"use client";
import { Search, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { navLinks } from "../constants/ContentConstants";
import { useAuth } from "../utils/AuthContext";
import { useCart } from "../utils/CartContext";
import Swal from "sweetalert2";
import { useCurrency } from "../utils/CurrencyContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [collections, setCollections] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { cartCount, updateCart } = useCart(); // Get the cart count from context
  // const [currency, setCurrency] = useState("USD"); // Default currency is 'USD'

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsChecked(!isChecked);
  };

  // console.log(isMenuOpen);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsChecked(!isChecked);
  };

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    closeMenu();
    // Await the cart update before showing the success message
    await updateCart(); // Fetch the latest cart data and update the context
    Swal.fire({
      title: "Success!",
      text: "Logout successful",
      icon: "success",
      confirmButtonColor: "#000000",
      confirmButtonText: "Close",
    });
    // Optionally, you can redirect to the home page or show a logout success message
    // router.push('/');
    // Trigger a custom event to notify other components
    window.dispatchEvent(new Event("storage"));
  };

  // Fetch collections from the API
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

  const { currency, updateCurrency } = useCurrency();

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    updateCurrency(selectedCurrency);
  };
  return (
    <header className="pt-4 pb-4 bg-black">
      <h1 className="text-center text-white mb-4 md:mb-0 text-xs md:text-base tracking-widest">
        THANK U FOR SUPPORTING INDEPENDENT BRANDS ★
      </h1>
      <div className="mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between">
          <div className="flex-1 md:flex md:items-center">
            <Link className="block" href="/">
              <Image
                src="/logofull.png"
                width={100}
                height={100}
                style={{
                  width: "10rem",
                  height: "3rem",
                  objectFit: "contain",
                }}
                alt="logo"
              />
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-11 text-base tracking-wide font-medium">
                <li>
                  <Link
                    className="text-gray-200 transition hover:text-white"
                    href="/../shop"
                  >
                    SHOP
                  </Link>
                </li>

                <li className="relative group">
                  <span className="text-gray-200 cursor-pointer transition hover:text-white">
                    COLLECTIONS
                  </span>
                  <ul
                    className="absolute left-0 top-full pt-8 hidden w-48 bg-black text-gray-200 rounded-lg opacity-0 group-hover:block group-hover:opacity-100 transition-all duration-300 ease-in-out z-10"
                    onMouseEnter={(e) => {
                      e.currentTarget.classList.remove("hidden");
                      e.currentTarget.classList.add("block");
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.classList.remove("block");
                      e.currentTarget.classList.add("hidden");
                    }}
                  >
                    <li>
                      <Link
                        href={`/../shop/collection/all`}
                        className="block px-4 py-1.5 hover:bg-gray-900"
                      >
                        All
                      </Link>
                    </li>

                    {collections.length > 0 ? (
                      collections.map((collection) => (
                        <li key={collection.id}>
                          <Link
                            href={`/../shop/collection/${collection.id}`}
                            className="block px-4 py-1.5 hover:bg-gray-900"
                          >
                            {collection.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li>
                        <span className="block px-4 py-2 text-gray-500">
                          {/* No collections available */}
                        </span>
                      </li>
                    )}
                  </ul>
                </li>
                {isLoggedIn && (
                  <li>
                    <Link
                      className="text-gray-200 transition hover:text-white"
                      href={"/../orders"}
                    >
                      ORDERS
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    className="text-gray-200 transition hover:text-white"
                    href={isLoggedIn ? "/" : "/../login"}
                    onClick={isLoggedIn ? handleLogout : undefined}
                  >
                    {isLoggedIn ? "LOGOUT" : "LOGIN"}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-7">
              <div className="flex gap-6">
                <a className="font-medium text-white shadow" href="#">
                  <Search size={23} />
                </a>

                <Link
                  className="relatives font-medium text-white shadow"
                  href="/../cart"
                >
                  <span className="relative">
                    <ShoppingBasket size={23} />
                    <span className="absolute -top-1 -right-2.5 bg-red-500 text-white rounded-full px-[0.28rem] text-xs">
                      {cartCount}
                    </span>
                  </span>
                </Link>

                <div className="hidden md:block">
                  <select
                    name="currency"
                    id="currency"
                    className="w-full rounded-md border py-0.5 border-gray-500 text-gray-300 sm:text-sm bg-black"
                    onChange={handleCurrencyChange}
                    value={currency} // Controlled component
                  >
                    <option disabled value="" className="text-white">
                      Currency
                    </option>
                    <option value="USD">USD</option>
                    <option value="NGN">NGN</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className="block md:hidden">
                <button className="hamburger mt-2.5" onClick={toggleMenu}>
                  <input type="checkbox" checked={isChecked} readOnly />
                  <svg viewBox="0 0 32 32">
                    <path
                      className="line line-top-bottom"
                      d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                    ></path>
                    <path className="line" d="M7 16 27 16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          isMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        } transform origin-top transition-transform duration-300 ease-in-out absolute mt-3 left-0 w-full z-50 md:hidden`}
      >
        {/* {isMenuOpen && ( */}
        <div className="fixed left-0 w-full bg-white shadow-sm py-2">
          <ul className="space-y-2 p-2 px-8">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`cursor-pointer p-1 leading-6 text-gray-800 hover:text-primary hover:font-semibold mr-0}`}
              >
                <Link
                  href={`/../${nav.id}`}
                  className="w-full block"
                  onClick={() => closeMenu()}
                >
                  {nav.title}
                </Link>
              </li>
            ))}

            <details
              className="group [&_summary::-webkit-details-marker]:hidden px-1"
              // open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5">
                <h2 className="font-medium text-gray-800">COLLECTION</h2>

                <span className="shrink-0 rounded-full bg-white p-1.5 text-gray-900 sm:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 shrink-0 transition duration-300 group-open:-rotate-45"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>

              <div className="px-3 mt-2 text-sm border-l border-red-300">
                <li>
                  <Link
                    href={`/../shop/collection/all`}
                    onClick={() => closeMenu()}
                    className="cursor-pointer p-1 leading-6 text-gray-800 hover:text-primary hover:font-semibold mr-0"
                  >
                    ALL
                  </Link>
                </li>
                {collections.length > 0 ? (
                  collections.map((collection) => (
                    <li key={collection.id} className="py-1">
                      <Link
                        href={`/../shop/collection/${collection.id}`}
                        onClick={() => closeMenu()}
                        className="cursor-pointer p-1 leading-6 text-gray-800 hover:text-primary hover:font-semibold mr-0"
                      >
                        {collection.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="block px-4 py-2 text-gray-500">
                      {/* No collections available */}
                    </span>
                  </li>
                )}
              </div>
            </details>
            {isLoggedIn && (
              <li
                className={`cursor-pointer p-1 leading-6 text-gray-800 hover:text-primary hover:font-semibold mr-0}`}
              >
                <Link
                  href={"/../orders"}
                  className="w-full block"
                  onClick={() => closeMenu()}
                >
                  ORDERS
                </Link>
              </li>
            )}
            <li
              className={`cursor-pointer p-1 leading-6 text-gray-800 hover:text-primary hover:font-semibold mr-0}`}
            >
              <Link
                href={isLoggedIn ? "/" : `login`}
                className="w-full block"
                onClick={isLoggedIn ? handleLogout : closeMenu}
              >
                {isLoggedIn ? "LOGOUT" : "LOGIN"}
              </Link>
            </li>
          </ul>
        </div>
        {/* )} */}
      </div>
    </header>
  );
}

export default Navbar;
