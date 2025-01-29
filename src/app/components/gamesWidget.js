import React, { useEffect, useState } from 'react';
import GameWidget from './gameWidget';
import { getFixtures } from '../../footballapi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';

export default function GamesWidget({ teams, leagues }) {
  const [games, setGames] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const fetchGames = async (teams, leagues) => {
      if (!teams || !leagues || isFetched) return;

      setIsFetched(true);

      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const threeDaysLater = new Date(today);
      threeDaysLater.setDate(today.getDate() + 8);

      const from = weekAgo.toISOString().split('T')[0];
      const to = threeDaysLater.toISOString().split('T')[0];
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('from:', from, 'to:', to, 'timezone:', timezone);
      console.log('Fetching games for teams:', teams);

      try {
        const allGames = [];
        console.log('tema length', teams.length);
        if (teams.length === undefined) {
          const fixtures = await getFixtures({
            leagueId: leagues,
            teamId: teams,
            from,
            to,
            timezone
          });
          allGames.push(...fixtures);
          setGames(allGames);
          console.log('Fetched games:', allGames);
        }
        else {
          for (const team of teams) {
            console.log('Fetching games for team:', team.teamId, 'in league:', team.leagueId);
            const fixtures = await getFixtures({
              leagueId: team.leagueId,
              teamId: team.teamId,
              from,
              to,
              timezone
            });
            allGames.push(...fixtures);
          }
          setGames(allGames);
          console.log('Fetched games:', allGames);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames(teams, leagues);
  }, [teams, leagues, isFetched]);

  return (
    <div>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation={true}
        modules={[Navigation]}        
        pagination={{ clickable: true }}
        loop={true}
      >
        {games.flat().map((game, index) => (
        <SwiperSlide key={index}>
          <div className='w-10/12 mx-auto rounded-md p-4 bg-gray-300'>
            <GameWidget key={`game-${index}`} game={game} />
          </div>
        </SwiperSlide>
      ))}
      </Swiper>

    </div>
    // <div>
    //   {games.flatMap((subArray, subArrayIndex) => 
    //   subArray.map((game, gameIndex) => (
    //     <GameWidget key={`game-${subArrayIndex}-${gameIndex}`} game={game} />
    //   ))
    //   )}
    // </div>
  );
}
