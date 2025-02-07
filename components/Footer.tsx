import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-primary border-[5px] border-black py-6 text-white text-center shadow-100">
      <p className="text-lg font-bold">
        &copy; 2025 CoCreateX. All rights reserved.
      </p>
      <p className="mt-2">
        Made with ❤️ by{" "}
        <Link
          target="_blank"
          href="https://www.nikcodes.tech"
          rel="noopener noreferrer"
          className="underline hover:text-accent transition"
        >
          Nikolas Manuel
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
