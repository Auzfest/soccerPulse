"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./components/header";
import LoadingScreen from "./components/loadingScreen";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/accountHome");
    }
  }, [status, router]);
  if (status === "loading") return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <LoadingScreen />
    </div>
  );
  if (status === "authenticated") return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <LoadingScreen />
    </div>
  );
  return (
    <div style={{ textAlign: "center" }}>
      <Header />
        <div className="bg-[url(./img/SoccerPulseHero_opaque.webp)] bg-center bg-cover text-white [text-shadow:_3px_3px_3px_rgb(0_0_0_/_100%)] container mx-auto p-6 my-10 rounded-md justify-center items-center text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Soccer Pulse</h1>
          <p className="text-3xl">Your one-stop destination for all things soccer!</p>
          <br />
          <p className="text-2xl w-1/2 mx-auto">
            Login or make an account to explore the latest standings, track your favorite teams, and stay up-to-date with upcoming games!
          </p>
          <br />
          <div className="grid grid-cols-2 lg:w-[20%] sm:w-full mx-auto mt-4 text-center justify-center items-center">
          <a href="/signin">
              <button className="col-start-1 mx-auto sm:block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-300">
                Log In
              </button>
            </a>
            <a href="/register">
              <button className="col-start-2 mx-auto sm:block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-300">
                Sign Up
              </button>
            </a>
          </div>
        </div>
        <div className="container mx-auto p-6 my-10 text-center">
          <div className="container mx-auto p-6 my-10 bg-slate-200 rounded-md text-center">
            <h2 className="text-2xl font-bold mb-4">What is Soccer Pulse?</h2>
            <p className="text-lg w-1/2 mx-auto">
              Soccer Pulse is your one-stop destination for all things soccer! Whether you're a casual fan or a die-hard supporter, our platform provides real-time statistics, match results, and team standings for professional soccer leagues worldwide.
            </p>
          </div>
          <br />
          <div className="container mx-auto p-6 my-10 bg-slate-200 rounded-md text-center">
            <h2 className="text-2xl font-bold mb-4">Why Choose Soccer Pulse?</h2>
            <p className="text-lg w-1/2 mx-auto">
              Unlike other platforms, Soccer Pulse offers a clean, ad-free experience with easy navigation and customization. Follow your favorite teams and leagues, track their latest performances, and stay updated without any hassle.
            </p>
          </div>
          <br />
          <div className="container mx-auto p-6 my-10 bg-slate-200 rounded-md text-center">
            <h2 className="text-2xl font-bold mb-4">A Personalized Experience</h2>
            <p className="text-lg w-1/2 mx-auto pb-8">
              Create an account to personalize your homepage! Get quick access to recent matches and stats of your favorite teams, all in one place.
            </p>
          </div>
          <br />
        </div>
    </div>
  );
}

const linkStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridTemplateRows: "1fr",
  width: "30%",
  margin: "auto",
  marginTop: "1rem",
  textDecoration: "none",
  justifyContent: "center",
  alignItems: "center",
};