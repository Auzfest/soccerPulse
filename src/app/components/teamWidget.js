import React from 'react';
import {useState, useEffect} from 'react';
import { getSpecificTeam } from '../../footballapi';

export default function TeamWidget({ leagueId, teamId }) {
    const [teamData, setTeamData] = useState(null);

    useEffect(() => {
      const fetchTeamData = async () => {
        if (!leagueId || !teamId) {
            console.error('Invalid leagueId or teamId');
            return
        };
  
        try {
          const data = await getSpecificTeam(leagueId, teamId);
          setTeamData(data); // Use the API response
          console.log(data);
        } catch (error) {
          console.error('Error fetching team data:', error);
        }
      };
  
      fetchTeamData();
    }, [leagueId, teamId]);
  
    if (!teamData) return <p>Loading team data...</p>;
  
    return (
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px',
        textAlign: 'center',
      }}>
        <h3>{teamData.team.name}</h3>
        <img src={teamData.team.logo} alt={teamData.team.name} style={{ width: '50px', height: '50px' }} />
        <p>League: {teamData.league.name}</p>
        <p>Games Played: {teamData.fixtures.played.total}</p>
        <p>Wins: {teamData.fixtures.wins.total}</p>
        <p>Draws: {teamData.fixtures.draws.total}</p>
        <p>Losses: {teamData.fixtures.loses.total}</p>
      </div>
    );
}
