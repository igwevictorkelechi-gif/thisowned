"use client";
/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../../../utils/AuthContext";
import { useCurrency } from "../../../../utils/CurrencyContext";

function RegisterPage() {
  const router = useRouter();
  const { updateCurrency } = useCurrency();
  const { setIsLoggedIn } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    password: "",
  });
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_AUTH_REGISTER_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        const data = await response.json();
        setCountries(data.countries);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_AUTH_REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          country: "",
          password: "",
        });
        if (result.access && result.refresh) {
          localStorage.setItem("accessToken", result.access);
          localStorage.setItem("refreshToken", result.refresh);

          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_USERS_URL}current`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${result.access}`,
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
        } else {
          console.warn("Access or refresh token missing in the response");
        }

        Swal.fire({
          title: "Success!",
          text: "Account created successfully",
          icon: "success",
          confirmButtonColor: "#e02e21",
          confirmButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/shop");
          }
        });
      } else {
        if (result.email && result.email.length > 0) {
          throw new Error(result.email[0]);
        } else {
          throw new Error("Registration failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "An error occurred. Please try again.");
      Swal.fire({
        title: "Error!",
        text: err.message || "Registration failed. Please try again.",
        icon: "error",
        confirmButtonColor: "#e02e21",
        confirmButtonText: "Close",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full border border-line bg-ink px-3 py-3 text-sm text-white placeholder:text-smoke focus:border-primary focus:outline-none";

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
          <p className="eyebrow mt-6 text-primary">Join The Mob</p>
          <h1 className="display mt-2 text-4xl">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="w-full">
              <label className="eyebrow text-white">First Name</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="w-full">
              <label className="eyebrow text-white">Last Name</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required className={inputClass} />
            </div>
          </div>
          <div>
            <label className="eyebrow text-white">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="relative">
            <label className="eyebrow text-white">Country</label>
            <ChevronDown className="pointer-events-none absolute bottom-3.5 right-3 size-4 text-smoke" />
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="mt-2 w-full appearance-none border border-line bg-ink px-3 py-3 text-sm text-white outline-none focus:border-primary"
            >
              <option value="">Select your country</option>
              {Array.isArray(countries) && countries.length > 0 ? (
                countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Loading...
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="eyebrow text-white">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" className={inputClass} />
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
              "Register"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-smoke">
          Already have an account?{" "}
          <Link href="login" className="font-bold uppercase tracking-wide text-primary hover:text-primary-dark">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
