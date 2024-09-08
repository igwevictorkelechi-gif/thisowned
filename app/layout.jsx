import { Rajdhani } from "next/font/google";
import "./globals.css";
import LenisScroll from "./LenisScroll";
import ClientLayout from "./component/ClientLayout";

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
