import { Rajdhani, Anton } from "next/font/google";
import "./globals.css";
import LenisScroll from "./LenisScroll";
import ClientLayout from "./component/ClientLayout";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: "Thisowned — See It. Touch It. Obtain It.",
  description:
    "Thisowned streetwear. Exclusive drops, hype essentials and limited apparel. See it. Touch it. Obtain it.",
  icons: {
    icon: "/logodark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${anton.variable}`}>
      <body className="bg-ink font-sans text-white antialiased">
        <LenisScroll />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
