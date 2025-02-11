"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Play Trivia", href: "/game" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#000000] to-[#555555] py-4 z-10 shadow-md px-4 fixed w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <img src="/images/geo.png" className="w-10 h-6"></img>
          <h1 className="text-white text-2xl font-bold">GeoExplorer Trivia</h1>
        </div>

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        <ul
          className={`flex space-x-8 md:flex md:items-center ${
            isOpen ? "block" : "hidden"
          } md:block`}
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-lg border rounded-lg border-[#7b7b7b] hover:border-[#fff] p-2 ${
                  pathname === link.href
                    ? " text-gray-200 font-bold"
                    : "text-[#8b8b8b] hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-[#000000] to-[#555555] py-4">
          <ul className="flex flex-col items-center space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-lg font-medium ${
                    pathname === link.href
                      ? "text-white underline"
                      : "text-gray-200 hover:text-white"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
