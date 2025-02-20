import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-300 border-b border-gray-200 px-4 sm:px-6 py-3 flex text-center justify-center space-x-12 mt-32">
          <Link href="/">
            <p className="hover:scale-110 font-bold transition ease-in-out duration-300">Home</p>
          </Link>
          <Link href="/privacyPolicy">
            <p className="hover:scale-110 font-bold transition ease-in-out duration-300">Privacy Policy</p>
          </Link>
          <Link href="/about">
            <p className="hover:scale-110 font-bold transition ease-in-out duration-300">About</p>
          </Link>
        </footer>
    );
};

export default Footer;
