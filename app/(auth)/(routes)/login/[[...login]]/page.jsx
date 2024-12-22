"use client";
/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../../../utils/AuthContext";
import { useCurrency } from "../../../../utils/CurrencyContext";

function Page() {
  const router = useRouter();
  const { updateCurrency } = useCurrency(); // Get currency and updateCurrency
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader
    setError(""); // Clear any previous errors

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_AUTH_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();

      // Store tokens securely
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // Fetch the current user data with the access token
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_USERS_URL}current`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.access}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const userData = await userResponse.json();
      const { country, currency } = userData;

      // Optionally store or display this data as needed
      // console.log("User Data:", { country, currency });

      localStorage.setItem("currency", currency);

      // Update currency in global state (assuming you use useCurrency context)
      updateCurrency(currency); // This will update the currency context globally

      // Update login state
      setIsLoggedIn(true);
      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event("storage"));

      Swal.fire({
        title: "Success!",
        text: "Login successful",
        icon: "success",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          // Check if there's a 'from' parameter in the URL
          const params = new URLSearchParams(window.location.search);
          const from = params.get("from");

          // Redirect to the 'from' page or default to shop
          router.push(from || "/shop");
          // router.replace(from || "/shop");
        }
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#000000",
        confirmButtonText: "Close",
      });
    } finally {
      setIsLoading(false); // Stop the loader
    }
  };

  return (
    <div>
      <main className="w-full flex flex-col items-center justify-center px-5 mt-[6rem] my-10">
        <div className="max-w-sm w-full text-gray-600 space-y-5">
          <div className="text-center pb-4">
            <Link className="flex items-center justify-center" href="/">
              <Image
                src="/thisowned-logo.png"
                width={100}
                height={100}
                style={{
                  width: "9rem",
                  height: "3rem",
                  objectFit: "contain",
                }}
                alt="logo"
              />
            </Link>
            <div className="mt-3">
              <h3 className="text-gray-800 text-2xl font-semibold tracking-wider">
                Log in to your account
              </h3>

              {/* {error && (
                <p className="text-red-500 text-base text-center mt-4">
                  {error}
                </p>
              )} */}
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-600 shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-600 shadow-sm rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  id="remember-me-checkbox"
                  className="checkbox-item peer hidden"
                />
                <label
                  htmlFor="remember-me-checkbox"
                  className="relative flex w-5 h-5 bg-white peer-checked:bg-red-600 rounded-md border ring-offset-2 ring-red-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                ></label>
                <span>Remember me</span>
              </div>
              <Link
                href=""
                className="text-center text-red-600 hover:text-red-500"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white font-medium hover:bg-gray-800 rounded-lg duration-150 
               flex items-center justify-center  ${
                 isLoading ? "bg-gray-800 py-2" : "bg-black"
               }`}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <div className="dot-spinner">
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
          {/* <button className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100">
            <svg
              className="w-5 h-5"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_17_40)">
                <path
                  d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                  fill="#4285F4"
                />
                <path
                  d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                  fill="#34A853"
                />
                <path
                  d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                  fill="#FBBC04"
                />
                <path
                  d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                  fill="#EA4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Continue with Google
          </button> */}

          <p className="text-center">
            Don't have an account?{" "}
            <Link
              href="register"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Page;
