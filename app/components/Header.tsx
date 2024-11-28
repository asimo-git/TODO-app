import { fetchQuote } from "../services/zenquotes";
import logo from "../../public/buddha-eye.png";
import Image from "next/image";

export default async function Header() {
  const quote = await fetchQuote();

  return (
    <header>
      <div className="px-3 d-flex justify-content-between align-items-center flex-wrap">
        <a href="/" className="m-2">
          <Image src={logo} alt="buddha's eyes logo" height={60} priority />
        </a>
        <div
          className="responsive-font mx-2 text-wrap"
          style={{ whiteSpace: "normal" }}
        >
          {quote}
        </div>
      </div>
    </header>
  );
}
