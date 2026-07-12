import Link from "next/link";
import { Truck, ShieldCheck, Flame, Headphones } from "lucide-react";
import Products from "./component/Products";

const categories = [
  {
    title: "New Arrivals",
    tag: "Just Dropped",
    href: "/shop",
    accent: true,
  },
  {
    title: "Shop All",
    tag: "The Full Range",
    href: "/shop",
    accent: false,
  },
  {
    title: "Collections",
    tag: "Curated Drops",
    href: "/shop/collection/all",
    accent: false,
  },
];

const perks = [
  { icon: Truck, title: "Fast Shipping", text: "Worldwide delivery on every order" },
  { icon: ShieldCheck, title: "Secure Checkout", text: "Flutterwave & Paystack protected" },
  { icon: Flame, title: "Weekly Drops", text: "New heat added every week" },
  { icon: Headphones, title: "Real Support", text: "We've got you, always" },
];

export default function Home() {
  return (
    <main className="bg-ink text-white">
      {/* HERO */}
      <section className="relative flex min-h-[82vh] items-center overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(224,46,33,0.28) 0%, rgba(224,46,33,0.04) 40%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 80px)",
          }}
        />
        <div className="section-x relative z-10 mx-auto w-full max-w-7xl py-20 text-center">
          <p className="eyebrow animate-fade-up text-primary">Thisowned — Est. Streetwear</p>
          <h1 className="display mt-5 text-[3.4rem] leading-[0.86] sm:text-[6rem] lg:text-[8.5rem]">
            See It.
            <br />
            Touch It. <span className="text-primary">Obtain It.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base uppercase tracking-wide text-smoke sm:text-lg">
            Exclusive drops, hype essentials and limited apparel. Wear what you own.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="btn-primary w-full sm:w-auto">
              Shop Now
            </Link>
            <Link href="/shop/collection/all" className="btn-outline w-full sm:w-auto">
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="section-x mx-auto max-w-7xl py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden border p-7 transition-colors duration-300 ${
                cat.accent
                  ? "border-primary bg-primary hover:bg-primary-dark"
                  : "border-line bg-surface hover:border-primary"
              }`}
            >
              <span
                className={`eyebrow ${cat.accent ? "text-white/80" : "text-primary"}`}
              >
                {cat.tag}
              </span>
              <div>
                <h3 className="display text-4xl sm:text-5xl">{cat.title}</h3>
                <span className="mt-3 inline-block text-xs font-bold uppercase tracking-widest text-white/90 transition group-hover:tracking-[0.3em]">
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section>
        <div className="section-x mx-auto flex max-w-7xl items-end justify-between pt-6">
          <div>
            <p className="eyebrow text-primary">Fresh Heat</p>
            <h2 className="display mt-2 text-4xl sm:text-6xl">New Arrivals</h2>
          </div>
          <Link
            href="/shop"
            className="hidden text-xs font-bold uppercase tracking-widest text-white/80 transition hover:text-primary sm:block"
          >
            View All →
          </Link>
        </div>
        <Products />
      </section>

      {/* PROMO BANNER */}
      <section className="border-y border-line bg-primary">
        <div className="section-x mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 py-14 text-center lg:flex-row lg:text-left">
          <div>
            <p className="eyebrow text-white/80">Members Get More</p>
            <h2 className="display mt-2 text-4xl text-white sm:text-6xl">
              Don&apos;t Sleep On The Drop
            </h2>
            <p className="mt-3 max-w-xl text-sm uppercase tracking-wide text-white/90">
              Create an account to track orders, save your cart and get early
              access to limited releases.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="btn-light">
              Create Account
            </Link>
            <Link href="/shop" className="btn-outline border-white/60 text-white">
              Browse The Range
            </Link>
          </div>
        </div>
      </section>

      {/* PERKS STRIP */}
      <section className="section-x mx-auto max-w-7xl py-14">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="flex flex-col items-center gap-3 border border-line bg-surface p-6 text-center"
            >
              <perk.icon className="size-8 text-primary" strokeWidth={1.5} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                {perk.title}
              </h3>
              <p className="text-xs uppercase tracking-wide text-smoke">
                {perk.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
