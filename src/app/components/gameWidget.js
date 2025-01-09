import React from 'react';

export default function GameWidget({ game }) {
  if (!game || game.length === 0) {
    return (
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px',
        textAlign: 'center',
      }}>
        <p>Fixtures are unavailable at the moment. Please try again later.</p>
      </div>
    );
  }

  console.log('Game:', game);

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
