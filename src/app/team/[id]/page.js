"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { getSpecificTeam } from '../../../footballapi';
import Header from '../../components/header';
import LoadingScreen from "../../components/loadingScreen";
import GamesWidget from '@/app/components/gamesWidget';

export default function TeamDetails() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const { id } = params;
    const [rawTeamId, rawLeagueId] = id ? id.split('-') : [];
    const teamId = parseInt(rawTeamId, 10);
    const leagueId = parseInt(rawLeagueId, 10);
    const [teamData, setTeamData] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteMessage, setFavoriteMessage] = useState(null);

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
        const leagueIdString = String(leagueId);
        const teamIdString = String(teamId);
        for (const favorite of data[0].Favorites[1]) {
            if (favorite[0] === leagueIdString && favorite[1] === teamIdString) {
                setIsFavorite(true);
            }
        }
        setLoading(false);
    };

    const handleAddFavorite = async (leagueId, teamId) => {
        if (!teamId) {
            alert("Please select a league first.");
            return;
        }
    
        try {
            const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail: session?.user?.email, newItem: { leagueId, teamId } }),
            });
            const data = await response.json();
            setFavoriteMessage("Successfully added to favorites!");
            setIsFavorite(true);
            } catch (error) {
            console.error("Error adding favorite:", error);
            setFavoriteMessage("Failed to add to favorites.", error);
            }
        }; 

    useEffect(() => {
        if (id) {
            const fetchTeamData = async () => {
                try {
                    const data = await getSpecificTeam(leagueId, teamId);
                    setTeamData(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching team data:', error);
                }
            };
            fetchTeamData(); 
        }
    }, [id]);

    useEffect(() => {
        if (status === "authenticated") {
            getFavorites();
        }
    }, [status]);

    const goBack = () => {
        router.back();
    };

    if (loading || !teamData) return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <LoadingScreen />
        </div>
        );

    return (
        <div className="min-h-screen">
        <Header />
        <div 
            className="min-h-screen bg-auto bg-top bg-no-repeat items-center justify-center mt-8"
            style={{ backgroundImage: `url(${teamData.league.logo})` }}
        >
        <button
            onClick={goBack}
            className="my-2 mx-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition static top-12 left-4"
          >
            ← Back
          </button>
        <div className="container mx-auto p-6 text-center">
          {/* Team Info Section */}
        <div className="mx-auto w-full h-2/3 flex items-center justify-center">
            <div className="p-6 text-center bg-slate-200 shadow-md rounded-lg max-w-fit">
                <img
                src={teamData.team.logo}
                alt={teamData.team.name}
                className="w-24 h-24 mx-auto mb-4"
                />
                <h1 className="text-3xl font-bold">{teamData.team.name}</h1>
                <p className="text-gray-600 text-lg">League: {teamData.league.name}</p>
                <p className="text-gray-600 text-lg">Country: {teamData.league.country}</p>
            </div>
        </div>

            {/* Team Statistics */}
<div className="mt-8 bg-slate-200 shadow-md rounded-lg p-6">
  <h2 className="text-2xl font-bold mb-4 text-center">Team Performance</h2>

  {/* Games Played */}
  <div className="w-full mb-6">
    <p className="font-semibold text-center">Games Played: {teamData.fixtures.played.total}</p>
    <div className="w-full bg-gray-300 h-4 rounded">
      <div className="w-full bg-gray-300 h-4 rounded flex">
        <div
            className="bg-blue-500 h-4 rounded-l"
            style={{ width: `${(teamData.fixtures.played.home / teamData.fixtures.played.total) * 100}%` }}
        ></div>
        <div
            className="bg-red-500 h-4 rounded-r"
            style={{ width: `${(teamData.fixtures.played.away / teamData.fixtures.played.total) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-700 mt-1">
            <span className="text-blue-600">Home: {teamData.fixtures.played.home}</span>
            <span className="text-red-600">Away: {teamData.fixtures.played.away}</span>
      </div>
    </div>
  </div>

  <div className="mb-6">
    <p className="font-semibold text-center">Match Results</p>
    <div className="w-full bg-gray-300 h-4 rounded flex">
      <div
        className="bg-green-500 h-4 rounded-l"
        style={{ width: `${(teamData.fixtures.wins.total / teamData.fixtures.played.total) * 100}%` }}
      ></div>
      <div
        className="bg-gray-500 h-4"
        style={{ width: `${(teamData.fixtures.draws.total / teamData.fixtures.played.total) * 100}%` }}
      ></div>
      <div
        className="bg-red-500 h-4 rounded-r"
        style={{ width: `${(teamData.fixtures.loses.total / teamData.fixtures.played.total) * 100}%` }}
      ></div>
    </div>
    <div className="flex justify-between text-sm text-gray-700 mt-1">
      <span className="text-green-600">Wins: {teamData.fixtures.wins.total}</span>
      <span className="text-gray-600">Draws: {teamData.fixtures.draws.total}</span>
      <span className="text-red-600">Losses: {teamData.fixtures.loses.total}</span>
    </div>
  </div>

  {/* Goals For and Goals Against on One Bar */}
  <div className="mb-2">
    <p className="font-semibold text-center">Goals Scored vs Conceded</p>
    <div className="w-full bg-gray-300 h-4 rounded flex">
      <div
        className="bg-green-400 h-4 rounded-l"
        style={{ width: `${(teamData.goals.for.total.total / (teamData.goals.for.total.total + teamData.goals.against.total.total)) * 100}%` }}
      ></div>
      <div
        className="bg-red-400 h-4 rounded-r"
        style={{ width: `${(teamData.goals.against.total.total / (teamData.goals.for.total.total + teamData.goals.against.total.total)) * 100}%` }}
      ></div>
    </div>
    <div className="flex justify-between text-sm text-gray-700 mt-1">
      <span className="text-green-600">Goals For: {teamData.goals.for.total.total}</span>
      <span className="text-red-600">Goals Against: {teamData.goals.against.total.total}</span>
    </div>
  </div>

  {/* Goal Difference */}
  <div className="mt-2 text-center ">
    <p className="text-xl font-bold">
      Goal Difference: 
      <span className={(teamData.goals.for.total.total/teamData.goals.against.total.total).toFixed(2) >= 0 ? "text-green-600" : "text-red-600"}>
        {" "}{(teamData.goals.for.total.total/teamData.goals.against.total.total).toFixed(2)}
      </span>
    </p>
  </div>
</div>

  
            {/* Favorite Button */}
            {status === "authenticated" && (
            <>
              {!isFavorite ? (
                <button
                  onClick={() => handleAddFavorite(leagueId, teamId)}
                  className="mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition ease-in-out duration-300 mx-auto"
                >
                  Add to Favorites
                </button>
              ) : (
                <p className="mt-4 text-green-600 font-semibold">{favoriteMessage}</p>
              )}
            </>
            )}
          </div>
            <div className="order-2 md:order-3 mx-auto max-w-2xl bg-slate-200 rounded-md text-center w-full m-0 lg:w-full p-8">
                <h1 className="text-xl font-bold mb-4">Recent and Upcoming Games</h1>
                <div className="h-full">
                    <GamesWidget teams={teamId} leagues={leagueId} />
                </div>
            </div>
            {/* Future implementation
            <p>Players:</p>
            <ul>
                {teamData.players.map(player => (
                    <li key={player.id}>{player.name}</li>
                ))}
            </ul> */}
        </div>
      </div>
    );
}
