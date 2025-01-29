"use client";
import { useEffect } from "react";  
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "../components/header";
import { getTeams, getSpecificTeam } from "../../footballapi";
import LoadingScreen from "../components/loadingScreen";

export default function AccountEdit() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [favorites, setFavorites] = useState({ leagues: [], teams: [] });
  const [error, setError] = useState(null);

  async function fetchAccount () {
    if (status === "authenticated" && session?.user?.email) {
          try {
          const Eheader = session?.user?.email;
          const response = await fetch('/api/favorites', {
          headers: { 'user-email': Eheader },
          });

          if (!response.ok) {
          const errorText = await response.text();
          console.error("Error fetching data:", errorText);
          return;
          }

          const data = await response.json();
          setName(data[0].Name);
          setEmail(data[0].Email);

        const leagueIds = data[0].Favorites[0] || [];
        const leaguesData = await Promise.all(
          leagueIds.map(async (leagueId) => {
              const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/standings?league=${leagueId}&season=2024`;
              const options = {
                  method: 'GET',
                  headers: {
                      'x-rapidapi-host': process.env.NEXT_PUBLIC_API_HOST,
                      'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
                  },
              };
              const response = await fetch(url, options);
              const data = await response.json();
            const leagueTeams = data.response;
            console.log(leagueTeams);
            return { 
              name: leagueTeams[0].league.name,
              leagueId: leagueId,
            };
          })
        );

        const teamsData = data[0].Favorites[1] || [];
        const teamsWithNames = await Promise.all(
          teamsData.map(async ([leagueId, teamId]) => {
            console.log(leagueId, teamId);
            const teamInfo = await getSpecificTeam(leagueId, teamId);
            return { 
            name: teamInfo.team.name,
            leagueId: leagueId,
            teamId: teamId,
            };
          })
        );

        setFavorites({
          leagues: leaguesData,
          teams: teamsWithNames,
        });
      } catch (error) {
          console.error("Error fetching favorites:", error);
      }
      finally {
        setLoading(false);  
      }
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    fetchAccount();
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/editAccount`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session?.user?.email,
              name,
              newEmail,
            }),
          });
      
          const result = await response.json();
      
          if (!response.ok) {
            console.log(result);
            throw new Error(result.message || "Something went wrong");
          }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteFavoriteLeague = async (leagueId) => {
    console.log("Deleting favorite:", leagueId);
    try {
      const updatedFavorites = { ...favorites };

      setFavorites(updatedFavorites);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteFavoriteLeague`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({ 
          Email: session?.user?.email,
          LeagueId: leagueId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete favorite");
      }
      fetchAccount();
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  const handleDeleteFavoriteTeam = async (leagueId, teamId) => {
    console.log("Deleting favorite:", leagueId, teamId);
    try {
      const updatedFavorites = { ...favorites };

      setFavorites(updatedFavorites);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteFavorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({ 
          Email: session?.user?.email,
          Favorite: {
            LeagueId: leagueId,
            TeamId: teamId
          }, 
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete favorite");
      }
      fetchAccount();
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <LoadingScreen />
    </div>
    );

  return (
        <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800">Edit Account</h1>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-semibold">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Email:</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
  
        {/* Favorites Section */}
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Your Favorites</h2>
  
          {/* Leagues Section */}
          <h3 className="text-xl font-semibold mt-6 text-gray-700">Leagues</h3>
          {favorites.leagues.length > 0 ? (
            console.log(favorites.leagues),
            <ul className="mt-4 space-y-2">
              {favorites.leagues.map((league, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
                >
                  <span className="text-gray-800">{league.name}</span>
                  <button
                    onClick={() => handleDeleteFavoriteLeague(league.leagueId)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No favorite leagues</p>
          )}
  
          {/* Teams Section */}
          <h3 className="text-xl font-semibold mt-6 text-gray-700">Teams</h3>
          {favorites.teams.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {favorites.teams.map((team, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
                >
                  <span className="text-gray-800">{team.name}</span>
                  <button
                    onClick={() => handleDeleteFavoriteTeam(team.leagueId, team.teamId)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No favorite teams</p>
          )}
        </div>
      </div>
  );
}
