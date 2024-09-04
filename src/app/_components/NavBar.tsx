"use client";

import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 lg:px-8">
      <div className="flex items-center gap-2">
        <Image
          className="relative rounded-full h-10 w-10 mx-auto object-cover z-20 border-4"
          src={"/logo.png"}
          alt="logo"
          width={12}
          height={12}
        ></Image>
        <span className="text-lg font-semibold">Easy Rag</span>
      </div>
      <nav className="hidden lg:flex lg:items-center lg:gap-4">
        <Link className="text-sm font-medium hover:underline" href="/home">
          Home
        </Link>
        <Link className="text-sm font-medium hover:underline" href="/about">
          About
        </Link>
        <Link className="text-sm font-medium hover:underline" href="/contact">
          Contact Us
        </Link>
      </nav>
      <div className="flex items-center gap-4"></div>
    </header>
  );
}
