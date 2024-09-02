import { Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: "500" });

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
      <body className={rajdhani.className}>{children}</body>
    </html>
  );
}
