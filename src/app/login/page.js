"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/footer';
import LoadingScreen from '../components/loadingScreen';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        setLoading(true);
        e.preventDefault();
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        setLoading(false);

        if (result?.error) {
          setError("Invalid email or password. Please try again.");
        } else {
          router.push('/accountHome');
        }
      };

      if (loading) { return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <LoadingScreen />
        </div>
        );
      }

    return (
        <div>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
                    <form onSubmit={handleLogin} className="mt-4">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-semibold">Email *</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-semibold">Password *</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                            />
                        </div>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-center text-gray-600 mt-4">
                        Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
