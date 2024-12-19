"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { getSpecificTeam } from '../../../footballapi';
import handleAddFavorite from '../../teamSearch/page';
import Header from '../../components/header';

export default function TeamDetails() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const params = useParams();
    console.log(params);
    const { id } = params;
    const [teamId, leagueId] = id ? id.split('-') : [];
    const [teamData, setTeamData] = useState(null);
    console.log(id, leagueId, teamId);

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
        }
    }, [id]);

    {status === "authenticated" && (
        <button
        onClick={() => handleAddFavorite(selectedLeague)}
        className="bg-green-500 text-white rounded px-3 py-1 disabled:bg-gray-400"
        >
        +
        </button>
    )}

    const goBack = () => {
        router.back();
    };

    if (!teamData) return <p>Loading...</p>;

    return (
        console.log(teamData),
        <div>
            <Header />

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
            {status === "authenticated" && (
                <button
                onClick={() => handleAddFavorite(selectedLeague)}
                className="bg-green-500 text-white rounded px-3 py-1 disabled:bg-gray-400"
                >
                +
                </button>
            )}
            {/* Future implementation
            <p>Players:</p>
            <ul>
                {teamData.players.map(player => (
                    <li key={player.id}>{player.name}</li>
                ))}
            </ul> */}
            <button onClick={() => goBack()}>Back</button>
        </div>
    );
}
