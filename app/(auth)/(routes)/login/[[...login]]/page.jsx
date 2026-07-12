"use client";
/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { successToast } from "../../../../utils/toast";
import { useAuth } from "../../../../utils/AuthContext";
import { useCurrency } from "../../../../utils/CurrencyContext";

function Page() {
  const router = useRouter();
  const { updateCurrency } = useCurrency();
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

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

      localStorage.setItem("currency", currency);

      updateCurrency(currency);

      setIsLoggedIn(true);
      window.dispatchEvent(new Event("storage"));

      // Redirect immediately — the toast confirms without blocking
      successToast("Login successful");
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      router.push(from || "/shop");
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-md border border-line bg-surface p-8 sm:p-10">
        <div className="text-center">
          <Link className="inline-flex items-center justify-center" href="/">
            <Image
              src="/thisowned-logo.png"
              width={160}
              height={54}
              style={{ width: "9rem", height: "3rem", objectFit: "contain" }}
              alt="Thisowned"
            />
          </Link>
          <p className="eyebrow mt-6 text-primary">Members Only</p>
          <h1 className="display mt-2 text-4xl">Welcome Back</h1>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="eyebrow text-white">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-line bg-ink px-3 py-3 text-sm text-white placeholder:text-smoke focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow text-white">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-line bg-ink px-3 py-3 text-sm text-white placeholder:text-smoke focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <label className="flex cursor-pointer items-center gap-2 text-smoke">
              <input type="checkbox" className="size-4 accent-primary" />
              Remember me
            </label>
            <Link href="" className="font-bold uppercase tracking-widest text-primary hover:text-primary-dark">
              Forgot?
            </Link>
          </div>
          <button
            type="submit"
            className="btn-primary flex w-full items-center justify-center disabled:opacity-70"
            disabled={isLoading}
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

        <p className="mt-6 text-center text-sm text-smoke">
          Don't have an account?{" "}
          <Link href="register" className="font-bold uppercase tracking-wide text-primary hover:text-primary-dark">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Page;
