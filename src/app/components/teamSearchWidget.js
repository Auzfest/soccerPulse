"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import handleAddFavorite from '../teamSearch/page';
import { useRouter } from 'next/navigation';

const TeamSearchWidget = ({ league }) => {
const [teams, setTeams] = useState([]);
const [favorites, setFavorites] = useState([]);
const [isFavorite, setIsFavorite] = useState(false);
const { data: session, status } = useSession();
const router = useRouter();

useEffect(() => {
    const fetchTeams = async () => {
      if (!league) return;
      console.log("Fetching teams for league:", league);
      try {
        const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/teams?league=${league}&season=2024`;
        console.log(url);
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-host': process.env.NEXT_PUBLIC_API_HOST,
                'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
            },
        };
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        const leagueTeams = data.response || [];
        setTeams(leagueTeams);
        console.log("Teams:", leagueTeams);
      } catch (error) {
        console.error("Error fetching standings:", error);
      }
    };

    fetchTeams();
  }, [league]);

  const getFavorites = async () => {
    const response = await fetch('/api/favorites', {
        method: 'GET',
        headers: {
            'user-email': session?.user?.email,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch favorites");
    }

    const data = await response.json();
    setFavorites(data[0].Favorites[1]); 
  };

  const isTeamFavorite = (teamId) => {
    for (const favorite of favorites) {
      if (favorite[0] == league && favorite[1] == teamId) {
        return true;
      }
    }
    return false;
  };

  const handleAddFavorite = async (leagueId, teamId) => {
    if (!teamId) {
        alert("Please select a league first.");
        return;
    }

    try {
      const getResponse = await fetch('/api/favorites', {
        method: 'GET',
        headers: {
            'user-email': session?.user?.email,
        },
        });

        if (!getResponse.ok) {
            throw new Error("Failed to fetch favorites");
        }
        const favoritesData = await getResponse.json();

        const existingFavorites = favoritesData.length > 0 ? favoritesData[0].Favorites || [] : [];
        const isAlreadyFavorite = existingFavorites.some(fav => fav[1] === String(teamId));

        if (isAlreadyFavorite) {
            alert("This team is already in your favorites!");
            return;
        }

        const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: session?.user?.email, newItem: { leagueId, teamId } }),
        });
        const data = await response.json();
        console.log("Response from backend:", data);
        } catch (error) {
        console.error("Error adding favorite:", error);
        alert("Failed to add the team to favorites.");
        }
    }; 

  useEffect(() => {
    console.log("User authentication status:", status);
    if (status === "authenticated") {
      console.log("getting favorites");
      getFavorites();
    }
  }, [status]);

  const handleViewDetails = (teamId) => {
    router.push(`/team/${teamId}-${league}`);
  };


  if (teams.length === 0) {
    return (
      <div style={{
        padding: '10px',
        textAlign: 'center',
      }} className="bg-gray-400">
        <p>Please search a league to view teams</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {teams.map(team => (
        <div key={team.team.id} className="bg-gray-300 shadow-md rounded-lg p-6 text-center border border-gray-300 transition hover:shadow-lg">
          {/* Team Logo */}
          <img src={team.team.logo} alt={team.team.name} className="w-32 h-32 mx-auto mb-3" />
          
          {/* Team Name */}
          <h2 className="text-lg font-bold text-gray-800">{team.team.name}</h2>
          
          {/* Venue */}
          <p className="text-gray-600">{team.venue.name}, {team.venue.city}, {team.team.country}</p>
          <p className="text-gray-500 text-sm">Capacity: {team.venue.capacity}</p>

          {/* Buttons */}
          <div className="mt-4 flex flex-col space-y-2">
            <button 
              onClick={() => handleViewDetails(team.team.id)} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View More Details
            </button>

            {status === "authenticated" && !isTeamFavorite(team.team.id) && (
              <button
                onClick={() => handleAddFavorite(league, team.team.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add as Favorite
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamSearchWidget;
