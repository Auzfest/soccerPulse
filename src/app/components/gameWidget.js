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

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      margin: '10px',
      textAlign: 'center',
    }}>
      {game !== null ? (
        <>
          <h3><img src={game.teams.home.logo} alt={game.teams.home.name} />{game.teams.home.name}</h3>
            <h3>vs</h3> <h3><img src={game.teams.away.logo} alt={game.teams.away.name} />{game.teams.away.name}</h3>
          <p>Date: {new Date(game.fixture.date).toLocaleString()}</p>
          <p>Venue: {game.fixture.venue.name}</p>
          <p>Status: {game.fixture.status.long}</p>
          <p>Score: {game.goals.home ?? '-'} - {game.goals.away ?? '-'}</p>
        </>
      ) : (
      <p>Fixtures are unavailable at the moment. Please try again later.</p>
      )
      }
    </div>
  );
}
