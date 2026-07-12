"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { JOINED_KEY } from "../../component/WaitlistPopup";

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_WAITLIST_URL || "/api/waitlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
          }),
        }
      );

      if (response.ok) {
        setStatus("success");
        setMessage("You're on the list! We'll be in touch soon.");
        setFormData({ firstName: "", lastName: "", email: "" });
        try {
          // Suppress the homepage popup — this visitor has joined
          localStorage.setItem(JOINED_KEY, "1");
        } catch (err) {
          /* ignore */
        }
      } else {
        throw new Error("Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Failed to join waitlist.");
    }
  };

  const inputClass =
    "w-full border border-line bg-surface p-3.5 text-sm text-white placeholder:text-smoke focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink p-6 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(224,46,33,0.25) 0%, transparent 60%)",
        }}
      />
      <main className="z-10 mb-8 mt-8 flex w-full max-w-md flex-col items-center text-center">
        <div className="relative mb-8 h-24 w-64">
          <Image
            src="/logo.png"
            fill
            style={{ objectFit: "contain" }}
            alt="Thisowned Logo"
            priority
          />
        </div>

        {status === "success" ? (
          <div className="flex animate-fade-up flex-col items-center border border-line bg-surface p-8">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-green-500/20 text-green-500">
              <svg className="size-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="display text-3xl">Welcome Aboard</h3>
            <p className="mt-2 text-sm text-smoke">{message}</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 text-xs font-bold uppercase tracking-widest text-primary transition hover:text-primary-dark"
            >
              Join another email
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow mb-8 text-smoke">Stay Tuned</p>

            <h1 className="display mb-8 text-5xl sm:text-6xl">Join The Waitlist</h1>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                className={inputClass}
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className={inputClass}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className={inputClass}
              />

              {status === "error" && (
                <div className="text-center text-xs text-primary">{message}</div>
              )}

              <button
                disabled={status === "loading"}
                className="btn-primary mt-2 flex w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? (
                  <svg className="size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Join"
                )}
              </button>
            </form>

            <Link
              href="/"
              className="mt-10 text-xs font-bold uppercase tracking-widest text-smoke transition hover:text-primary"
            >
              ← Back to store
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
