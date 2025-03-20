import { useSession } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
    const defaultColor = "#E2E8F0";
    const [mainColor, setMainColor] = useState(defaultColor);
    const { data: session } = useSession();

    const applyColor = (color) => {
        document.documentElement.style.setProperty('--main-color', color);
    };

    useEffect(() => {
        const fetchUserColor = async () => {
            if (session) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getUserColor?id=${session.user.id}`);
                    const data = await response.json();
                    const userColor = data.mainColor;
                    ("Fetched user color:", userColor);
                    if (userColor) {
                        updateMainColor(userColor);
                    } else {
                        applyColor(defaultColor);
                    }
                } catch (error) {
                    console.error("Failed to fetch user color:", error);
                    applyColor(defaultColor);
                }
            } else {
                const storedColor = localStorage.getItem('mainColor');
                if (storedColor) {
                    updateMainColor(storedColor);
                } else {
                    applyColor(defaultColor);
                }
            }
        };

        fetchUserColor();
    }, [session]);

    // Update both state and localStorage when color changes
    const updateMainColor = (color) => {
        setMainColor(color);
        localStorage.setItem('mainColor', color);
        applyColor(color);
    };

    return (
        <ColorContext.Provider value={{ mainColor, updateMainColor }}>
            {children}
        </ColorContext.Provider>
    );
};
