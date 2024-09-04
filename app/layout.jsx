import { Rajdhani } from "next/font/google";
import "./globals.css";
import LenisScroll from "./LenisScroll";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "Thisowned",
  description: "",
  icons: {
    icon: "/logodark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={rajdhani.className}>
        <LenisScroll />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
