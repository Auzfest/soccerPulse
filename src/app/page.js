"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./components/header";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/accountHome");
    }
  }, [status, router]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Header />
        <>
          <h1>Welcome to SoccerPulse</h1>
          <p>Your one-stop destination for all things soccer.</p>
          <p>
            Explore the latest standings, track your favorite teams, and stay up-to-date with upcoming games!
          </p>
          <div style={{ marginTop: "20px" }}>
            <a href="/api/auth/signin" style={linkStyle}>
              <button style={buttonStyle}>Log In</button>
            </a>
            <a href="/signup" style={linkStyle}>
              <button style={buttonStyle}>Sign Up</button>
            </a>
          </div>
        </>
    </div>
  );
}

const linkStyle = {
  textDecoration: "none",
  margin: "0 10px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  color: "#fff",
  backgroundColor: "#0070f3",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

