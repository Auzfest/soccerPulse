import React, { useEffect, useState } from 'react';
import GameWidget from './gameWidget';

export default function GamesWidget({ teams, leagues }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async (teams, leagues) => {
      if (!teams || !leagues) return;

      const today = new Date();
      const threeDaysLater = new Date(today);
      threeDaysLater.setDate(today.getDate() + 3);

      const from = today.toISOString().split('T')[0];
      const to = threeDaysLater.toISOString().split('T')[0];
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      try {
        const allGames = [];
        for (const league of leagues) {
          for (const team of teams) {
            const fixtures = await getFixtures({
              leagueId: league.id,
              teamId: team.id,
              from,
              to,
              timezone
            });
            allGames.push(...fixtures);
          }
        }
        setGames(allGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames(teams, leagues);
  }, [teams, leagues]);

  return (
    <div>
      {games.map(game => (
        <GameWidget key={game.id} game={game} />
      ))}
    </div>
  );
}
