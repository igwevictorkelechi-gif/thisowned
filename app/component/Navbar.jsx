"use client";
import { Search, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { navLinks } from "../constants/ContentConstants";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsChecked(!isChecked);
  };

  // console.log(isMenuOpen);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsChecked(!isChecked);
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
                    href="shop"
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
                      <a
                        href="#option1"
                        className="block px-4 py-2 hover:bg-gray-700"
                      >
                        Option 1
                      </a>
                    </li>
                    <li>
                      <a
                        href="#option2"
                        className="block px-4 py-2 hover:bg-gray-700"
                      >
                        Option 2
                      </a>
                    </li>
                    <li>
                      <a
                        href="#option3"
                        className="block px-4 py-2 hover:bg-gray-700"
                      >
                        Option 3
                      </a>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link
                    className="text-gray-200 transition hover:text-white"
                    href="#"
                  >
                    LOGIN
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-7">
              <div className="flex gap-6">
                <a className="font-medium text-white shadow" href="#">
                  <Search size={23} />
                </a>

                <a className="font-medium text-white shadow" href="#">
                  <ShoppingBasket size={23} />
                </a>
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
        } transform origin-top transition-transform duration-300 ease-in-out absolute mt-3 left-0 w-full z-60 md:hidden`}
      >
        {/* {isMenuOpen && ( */}
        <div className="fixed left-0 w-full bg-white shadow-sm py-2">
          <ul className="space-y-2 p-2 px-8">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`cursor-pointer p-1 font-primary leading-6 text-gray-800 hover:text-primary hover:font-semibold mr-0}`}
              >
                <Link
                  href={`${nav.id}`}
                  className="w-full block"
                  onClick={() => closeMenu()}
                >
                  {nav.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* )} */}
      </div>
    </header>
  );
}

export default Navbar;
