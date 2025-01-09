import React, { useEffect, useState } from 'react';
import GameWidget from './gameWidget';
import { getFixtures } from '../../footballapi';

export default function GamesWidget({ teams, leagues }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async (teams, leagues) => {
      if (!teams || !leagues) return;

      const today = new Date();
      const threeDaysLater = new Date(today);
      threeDaysLater.setDate(today.getDate() + 8);

      const from = today.toISOString().split('T')[0];
      const to = threeDaysLater.toISOString().split('T')[0];
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('from:', from, 'to:', to, 'timezone:', timezone);
      console.log('Fetching games for teams:', teams);

      try {
        const allGames = [];
        for (const team of teams) {
          console.log('Fetching games for team:', team.teamId, 'in league:', team.leagueId);
          const fixtures = await getFixtures({
            leagueId: team.leagueId,
            teamId: team.teamId,
            from,
            to,
            timezone
          });
          allGames.push(fixtures);
        }
        setGames(allGames);
        console.log('Fetched games:', allGames);
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
