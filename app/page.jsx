import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import Products from "./component/Products";

export default function Home() {
  return (
    <main className="mx-auto bg-black text-white">
      <header className="text-center pt-14">
        <h2 className="text-xl font-bold text-white sm:text-3xl tracking-wider">
          Recent Products
        </h2>
      </header>
      <Products />
    </main>
  );
}
