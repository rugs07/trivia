'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Play Trivia', href: '/game' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#000000] to-[#555555] py-4 shadow-md px-4 fixed w-full">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">GeoExplorer Trivia</h1>
        <ul className="flex space-x-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-lg font-medium ${
                  pathname === link.href
                    ? 'text-white underline'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
