import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

const Header = () => {
    const { data: session, status } = useSession();

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200">
      <h1 className="text-3xl font-bold">
        <Link href="/">
          <p>Soccer Pulse</p>
        </Link>
      </h1>
      <nav className="flex space-x-4">
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
      {status === "authenticated" ? (
        <div className="flex items-center space-x-4">
          <p className="text-gray-700">Welcome, {session.user?.email || "User"}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/login">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
        </Link>
      )}
    </header>
  );
};

export default Header;
