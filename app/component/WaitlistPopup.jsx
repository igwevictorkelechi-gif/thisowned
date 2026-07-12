"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";

// Permanent flag — only set once the visitor has actually joined the list.
export const JOINED_KEY = "to_waitlist_joined";
// Per-visit flag — dismissing hides the popup for this session only, so it
// shows again the next time the visitor returns (until they join).
const DISMISSED_KEY = "to_waitlist_dismissed";

export default function WaitlistPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Never show on the dedicated waitlist page
    if (pathname && pathname.startsWith("/waitlist")) return;

    let suppressed = false;
    try {
      suppressed =
        localStorage.getItem(JOINED_KEY) === "1" ||
        sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch (e) {
      suppressed = false;
    }
    if (suppressed) return;

    const timer = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(timer);
  }, [pathname]);

  const dismiss = () => {
    setOpen(false);
    try {
      // Session-only: the popup returns on the next visit until they join
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch (e) {
      /* ignore */
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] || "Member";
    const lastName = parts.slice(1).join(" ") || parts[0] || "Member";

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_WAITLIST_URL || "/api/waitlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email.trim(),
          }),
        }
      );

      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list. Watch your inbox for the drop.");
        try {
          localStorage.setItem(JOINED_KEY, "1");
        } catch (err) {
          /* ignore */
        }
        return;
      }

      // Duplicate email or validation error
      let data = null;
      try {
        data = await res.json();
      } catch (err) {
        data = null;
      }
      if (data && data.email) {
        setStatus("error");
        setMessage("Looks like you're already on the list.");
        try {
          // They're already subscribed — stop showing the popup on return
          localStorage.setItem(JOINED_KEY, "1");
        } catch (err) {
          /* ignore */
        }
      } else {
        throw new Error("Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to join. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Join the waitlist"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md animate-fade-up border border-line bg-surface p-8 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 text-smoke transition hover:text-primary"
        >
          <X size={22} />
        </button>

        {/* Red glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(100% 60% at 50% 0%, rgba(224,46,33,0.22) 0%, transparent 60%)",
          }}
        />

        <div className="relative text-center">
          <Image
            src="/logo.png"
            width={150}
            height={50}
            style={{ width: "8.5rem", height: "auto", margin: "0 auto" }}
            alt="Thisowned"
          />

          {status === "success" ? (
            <>
              <h2 className="display mt-6 text-4xl">You&apos;re In</h2>
              <p className="mt-3 text-sm text-smoke">{message}</p>
              <button onClick={dismiss} className="btn-primary mt-7 w-full">
                Start Shopping
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow mt-6 text-primary">Don&apos;t Sleep</p>
              <h2 className="display mt-2 text-4xl sm:text-5xl">Join The Waitlist</h2>
              <p className="mx-auto mt-3 max-w-xs text-sm text-smoke">
                Get early access to exclusive drops and restocks before anyone else.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="YOUR NAME"
                  className="w-full border border-line bg-ink px-4 py-3 text-sm text-white placeholder:text-smoke focus:border-primary focus:outline-none"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL"
                  className="w-full border border-line bg-ink px-4 py-3 text-sm text-white placeholder:text-smoke focus:border-primary focus:outline-none"
                />

                {status === "error" && (
                  <p className="text-center text-xs font-semibold uppercase tracking-wide text-primary">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full disabled:opacity-70"
                >
                  {status === "loading" ? "Joining..." : "Join The Mob"}
                </button>
              </form>

              <button
                onClick={dismiss}
                className="mt-4 text-[0.7rem] font-bold uppercase tracking-widest text-smoke transition hover:text-white"
              >
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
