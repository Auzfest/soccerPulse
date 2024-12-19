"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import handleAddFavorite from '../teamSearch/page';
import { useRouter } from 'next/navigation';

const TeamSearchWidget = ({ league }) => {
const [teams, setTeams] = useState([]);
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

  const handleAddFavorite = async (leagueId, teamId) => {
    if (!teamId) {
        alert("Please select a league first.");
        return;
    }
    console.log("User authentication status:", status);
    console.log("User session:", session);

    try {
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
    console.log(teams)
}, []);

  const handleViewDetails = (teamId) => {
    router.push(`/team/${teamId}-${league}`);
  };

  return (
    <div>
      {teams.map(team => (
        console.log(team),
        <div key={team.team.id}style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            margin: '10px',
            textAlign: 'center',
          }}>
            <h1>{team.team.name}</h1>
            <img src={team.team.logo} alt={team.team.name} style={{ width: '50px', height: '50px' }} />
            <h2>Venue: {team.venue.name}</h2>
            <h3>{team.venue.address}, {team.venue.city}, {team.team.country}</h3>
            <p>Capacity: {team.venue.capacity}</p>
            <button onClick={() => handleViewDetails(team.team.id)}>View</button>

            {status === "authenticated" && (
                <button
                onClick={() => handleAddFavorite(league, team.team.id)}
                className="bg-green-500 text-white rounded px-3 py-1 disabled:bg-gray-400"
                >
                +
                </button>
            )}
        </div>
      ))}
    </div>
  );
};

export default TeamSearchWidget;
