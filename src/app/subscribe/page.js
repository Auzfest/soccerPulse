"use client";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your-publishable-key');

export default function SubscriptionPage() {
    const handleSubscribe = async () => {
        const response = await fetch('/api/subscribe', { method: 'POST' });
        const data = await response.json();
        const stripe = await stripePromise;

        if (stripe) {
            await stripe.redirectToCheckout({ sessionId: data.sessionId });
        }
    };

    return (
        <button onClick={handleSubscribe}>Subscribe</button>
    );
}
