"use client";
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useState } from 'react';
import { HiMenu, HiX } from "react-icons/hi"; // Icons for mobile menu

const Header = () => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-300 border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl sm:text-3xl font-bold">
          <Link href="/">
            <p>Soccer Pulse</p>
          </Link>
        </h1>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-gray-700 focus:outline-none"
        >
          {menuOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex space-x-4">
          <Link href="/">
            <p className="hover:underline">Home</p>
          </Link>
          <Link href="/leagueSearch">
            <p className="hover:underline">Leagues</p>
          </Link>
          <Link href="/teamSearch">
            <p className="hover:underline">Teams</p>
          </Link>
        </nav>

        {/* Desktop Authentication Buttons */}
        {status === "authenticated" ? (
          <div className="hidden sm:flex items-center space-x-4">
            <Link href="/accountEdit">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Account
              </button>
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="hidden sm:block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col mt-2 p-4 text-xl font-bold text-gray-800 text-center">
          <Link href="/" className="py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/leagueSearch" className="py-2" onClick={() => setMenuOpen(false)}>Leagues</Link>
          <Link href="/teamSearch" className="py-2" onClick={() => setMenuOpen(false)}>Teams</Link>

          {status === "authenticated" ? (
            <>
              <Link href="/accountEdit" className="py-2">
                <button
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Account
                </button>
              </Link>
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="py-2">
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
