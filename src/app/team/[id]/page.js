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
    const [favorites, setFavorites] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    console.log(id, leagueId, teamId);

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
        for (const favorite of data[0].Favorites[1]) {
            console.log(favorite);
            if (favorite[0] === leagueId && favorite[1] === teamId) {
                setIsFavorite(true);
                console.log("is favorite")
            }
            else {
                console.log("not favorite")
            }
        }
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
            console.log("Response from backend:", data);
            } catch (error) {
            console.error("Error adding favorite:", error);
            alert("Failed to add the team to favorites.");
            }
        }; 

    useEffect(() => {
        if (leagueId && teamId) {
            console.log(`Fetching data for League: ${leagueId}, Team: ${teamId}`);
        }
    }, [leagueId, teamId]);

    useEffect(() => {
        if (id) {
            const fetchTeamData = async () => {
                try {
                    const data = await getSpecificTeam(leagueId, teamId);
                    setTeamData(data);
                } catch (error) {
                    console.error('Error fetching team data:', error);
                }
            };
            fetchTeamData(); 
            setLoading(false);               
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
        console.log(teamData),
        <div>
            <Header />
            <button onClick={() => goBack()}>Back</button>
            <h1>{teamData.team.name}</h1>
            <img src={teamData.team.logo} alt={teamData.team.name} style={{ width: '100px', height: '100px' }} />
            <p>League: {teamData.league.name}</p>
            <p>Country: {teamData.league.country}</p>
            <p>Games Played: {teamData.fixtures.played.total}</p>
            <p>Wins: {teamData.fixtures.wins.total}</p>
            <p>Draws: {teamData.fixtures.draws.total}</p>
            <p>Losses: {teamData.fixtures.loses.total}</p>
            <p>Goals For : {teamData.goals.for.total.total}</p>
            <p>Goals Against: {teamData.goals.against.total.total}</p>
            <p>Goal Difference: {teamData.goals.difference}</p>
            {status === "authenticated" && !isFavorite && (
                <button
                onClick={() => handleAddFavorite(leagueId , teamId)}
                className="bg-green-500 text-white rounded px-3 py-1 disabled:bg-gray-400"
                >
                +
                </button>
            )}
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
    );
}
