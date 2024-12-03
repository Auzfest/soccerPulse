"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Something went wrong');
            }

            // Redirect to login page or home page after successful registration
            router.push('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link href="/login">Login here</Link></p>
        </div>
    );
}
