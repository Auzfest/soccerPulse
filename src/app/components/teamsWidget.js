import React from 'react';
import GameWidget from './teamWidget';

export default function TeamsWidget({ teams }) {
    if (!teams || teams.length === 0) {
        return <p>No teams available.</p>;
      }
    
      return (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
        }}>
          {teams.map((team, index) => (
            <GameWidget key={index} leagueId={team.leagueId} teamId={team.teamId} />
          ))}
        </div>
  );
}
