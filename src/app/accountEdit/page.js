"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSpecificTeam } from "../../footballapi";
import Footer from "../components/footer";
import Header from "../components/header";
import LoadingScreen from "../components/loadingScreen";

export default function AccountEdit() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [favorites, setFavorites] = useState({ leagues: [], teams: [] });
  const [leagueMessages, setLeagueMessages] = useState({});
  const [teamMessages, setTeamMessages] = useState({});
  const [leagueErrors, setLeagueErrors] = useState({});
  const [teamErrors, setTeamErrors] = useState({});
  const [mainColor, setMainColor] = useState("#E2E8F0");
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
              if (leagueId == 0) return 0;
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
            (leagueTeams);
            return { 
              logo: leagueTeams[0].league.logo,
              name: leagueTeams[0].league.name,
              leagueId: leagueId,
            };
          })
        );

        const teamsData = data[0].Favorites[1] || [];
        const teamsWithNames = await Promise.all(
          teamsData.map(async ([leagueId, teamId]) => {
            if (leagueId == 0) return 0;
            const teamInfo = await getSpecificTeam(leagueId, teamId);
            return { 
            logo: teamInfo.team.logo,
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

        setMainColor(data[0].MainColor || "#E2E8F0");
        document.documentElement.style.setProperty('--main-color', data[0].MainColor || "#3498db");
        

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   setLoading(true);
  //   try {
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/editAccount`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             email: session?.user?.email,
  //             name,
  //           }),
  //         });
      
  //         const result = await response.json();
      
  //         if (!response.ok) {
  //           throw new Error(result.message || "Something went wrong");
  //         }
  //         setLoading(false);
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/editAccount`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session?.user?.email,
              name,
              mainColor,  // Include the selected color
            }),
        });
      
        const result = await response.json();
      
        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }

        // Apply the new color immediately
        document.documentElement.style.setProperty('--main-color', mainColor);
        setLoading(false);
    } catch (error) {
        setError(error.message);
    }
};

const handleResetColor = () => {
  const defaultColor = "#E2E8F0"; 
  setMainColor(defaultColor);  

  document.documentElement.style.setProperty('--main-color', defaultColor);
};



  const handleDeleteFavoriteLeague = async (leagueId) => {
    try {
      setLeagueMessages((prevMessages) => ({
        ...prevMessages,
        [leagueId]: null,
      }));

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

      setLeagueMessages((prevMessages) => ({
        ...prevMessages,
        [leagueId]: "Favorite deleted successfully",
      }));

      fetchAccount();
    } catch (error) {
      console.error("Error deleting favorite:", error);
      setLeagueMessages((prevMessages) => ({
        ...prevMessages,
        [leagueId]: error.message,
      }));
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
  
      alert("Your account has been deleted.");
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account.");
    }
  };

  const handleDeleteFavoriteTeam = async (leagueId, teamId) => {
    try {
      setTeamErrors((prevMessages) => ({
        ...prevMessages,
        [leagueId]: null,
      }));
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
        throw new Error("Failed to unfavorite");
      }

      setTeamMessages((prevMessages) => ({
        ...prevMessages,
        [leagueId]: "Unfavorited successfully",
      }));

      fetchAccount();
    } catch (error) {
      console.error("Error unfavoriting:", error);
      setTeamMessages((prevMessages) => ({
        ...prevMessages,
        [leagueId]: error.message,
      }));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <LoadingScreen />
    </div>
    );

  return (
        <div className="min-h-screen">
        <Header />
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-main shadow-lg rounded-lg">
        <div className='mx-auto rounded-md p-4 bg-gray-300'>
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
            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Choose Main Color:</label>
              <input
              type="color"
              value={mainColor}
              onChange={(e) => setMainColor(e.target.value)}
              className="w-12 h-12 p-1 cursor-pointer"
                />
            </div>
            <div className="mt-4">
              <button
                  onClick={handleResetColor}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                  Reset to Default Color
              </button>
              <p>Temporary until save changes is applied</p>
            </div>
          </form>
          </div>
        </div>
        {/* Favorites Section */}
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-main shadow-lg rounded-lg">
    <div className="mx-auto rounded-md p-4 bg-gray-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Your Favorites</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4"> {/* Responsive grid: 1 column on mobile, 2 on larger screens */}
            {/* Leagues Section */}
            <div>
                <h3 className="text-xl font-semibold text-center text-gray-700">Leagues</h3>
                {favorites.leagues.length > 0 && favorites.leagues[0] != 0 ? (
                    <ul className="mt-4 space-y-2 text-center">
                        {favorites.leagues.map((league, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center p-4 bg-white rounded-md shadow-sm"
                            >
                                <img src={league.logo} alt={league.name} className="w-8 h-8 mb-2" />
                                <span className="text-gray-800">{league.name}</span>
                                {leagueMessages[league.leagueId] && (
                                    <div>
                                        <p className={`text-sm mt-1 ${leagueMessages[league.leagueId] === "Successfully deleted!" ? "text-green-500" : "text-red-500"}`}>
                                            {leagueMessages[league.leagueId]}
                                        </p>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleDeleteFavoriteLeague(league.leagueId)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                >
                                    Unfavorite
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-2 text-center">No favorite leagues</p>
                )}
            </div>

            {/* Teams Section */}
            <div>
                <h3 className="text-xl font-semibold text-center text-gray-700">Teams</h3>
                {favorites.teams.length > 0 && favorites.teams[0] != 0 ? (
                    <ul className="mt-4 space-y-2 text-center">
                        {favorites.teams.map((team, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center p-4 bg-white rounded-md shadow-sm"
                            >
                                <Link href={`/team/${team.teamId}-${team.leagueId}`} className="">
                                    <img src={team.logo} alt={team.name} className="w-8 h-8 mb-2" />
                                </Link>
                                <span className="text-gray-800">{team.name}</span>
                                {teamMessages[`${team.leagueId}-${team.teamId}`] && (
                                    <div>
                                        <p className={`text-sm mt-1 ${teamMessages[`${team.leagueId}-${team.teamId}`] === "Successfully deleted!" ? "text-green-500" : "text-red-500"}`}>
                                            {teamMessages[`${team.leagueId}-${team.teamId}`]}
                                        </p>
                                        </div>
                                )}
                                <button
                                    onClick={() => handleDeleteFavoriteTeam(team.leagueId, team.teamId)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                >
                                    Unfavorite
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-2 text-center">No favorite teams</p>
                )}
            </div>
        </div>
    </div>
</div>

        <div className="max-w-5xl mx-auto mt-8 p-6 bg-main shadow-lg rounded-lg text-center">
        <div className='mx-auto rounded-md p-4 bg-gray-300'>
        <p className="mt-4 text-gray-600 font-semibold"> Warning: This action cannot be undone. </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white font-semibold p-2 rounded-md hover:bg-red-700 transition mt-4"
          >
            Delete Account
          </button>  
        </div>
        </div>
        <Footer />
      </div>
  );
}
