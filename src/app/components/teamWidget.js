import React from 'react';
import {useState, useEffect} from 'react';
import { getSpecificTeam } from '../../footballapi';

export default function TeamWidget({ leagueId, teamId }) {
    const [teamData, setTeamData] = useState(null);
    const [failure, setFailure] = useState(false);

    useEffect(() => {
      const fetchTeamData = async () => {
        if (!leagueId || !teamId) {
            console.error('Invalid leagueId or teamId');
            return
        };
  
        try {
          console.log(`Fetching data for League: ${leagueId}, Team: ${teamId}`);
          const data = await getSpecificTeam(leagueId, teamId);
          setTeamData(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching team data:', error);
          setFailure(true);
        }
      };
  
      fetchTeamData();
    }, [leagueId, teamId]);
  
    if (!teamData) return <p>Loading team data...</p>;
    if (failure) {
        return (
          <div style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            margin: '10px',
            textAlign: 'center',
          }}>
            <p>Teams are unavailable at the moment. Please try again later.</p>
          </div>
        );
      }
    return (
      <div className="border border-gray-300 rounded-lg p-6 mx-4 my-6 flex flex-col items-center">
      {/* Team Logo */}
      <img
        src={teamData.team.logo}
        alt={teamData.team.name}
        className="w-32 h-32 object-contain mb-4"
      />

      {/* Team Name */}
      <h3 className="text-xl font-bold text-gray-800">{teamData.team.name}</h3>
      <p className="text-lg text-gray-600">{teamData.league.name}</p>

      {/* Team Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-center text-gray-700">
        <p><span className="font-semibold">Games Played:</span> {teamData.fixtures.played.total}</p>
        <p><span className="font-semibold">Wins:</span> {teamData.fixtures.wins.total}</p>
        <p><span className="font-semibold">Draws:</span> {teamData.fixtures.draws.total}</p>
        <p><span className="font-semibold">Losses:</span> {teamData.fixtures.loses.total}</p>
      </div>

      {/* View More Button */}
      <a
        href={`/team/${teamData.team.id}-${teamData.league.id}`}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ease-in-out duration-300"
      >
        View More
      </a>
    </div>
    );
}
