import React from 'react';

export default function GameWidget({ game }) {
  if (!game) return null;

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      margin: '10px',
      textAlign: 'center',
    }}>
      <h3>{game.teams.home.name} vs {game.teams.away.name}</h3>
      <p>Date: {new Date(game.fixture.date).toLocaleString()}</p>
      <p>Venue: {game.fixture.venue.name}</p>
      <p>Score: {game.goals.home ?? '-'} - {game.goals.away ?? '-'}</p>
    </div>
  );
}
