"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import StandingsWidget from '../components/standingsWidget';
import TeamsWidget from '../components/teamsWidget';
import GamesWidget from '../components/gamesWidget';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
// import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Navigation } from 'swiper/modules';

// SwiperCore.use([Navigation, Pagination]);

export default function AccountHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState({ leagues: [], teams: [] });
  const [widgetQueue, setWidgetQueue] = useState([]);
  const [loadedWidgets, setLoadedWidgets] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const Eheader = session?.user?.email;
          const response = await fetch('/api/favorites', {
            headers: { 'user-email': Eheader },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error fetching data:", errorText);
            return;
          }

          const data = await response.json();
          const favoritesData = data[0].Favorites;

          const leagues = favoritesData[0]?.map(item => item) || [];
          const teams = favoritesData[1]?.map(team => ({
            leagueId: team[0],
            teamId: team[1],
          })) || [];

          setFavorites({ leagues, teams });
          console.log('Favorites:', leagues, teams);
          setWidgetQueue([StandingsWidget, GamesWidget, TeamsWidget]);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      } else if (status === "unauthenticated") {
        router.push('/login');
      }
    };

    fetchFavorites();
  }, [status, session, router]);

  useEffect(() => {
    const loadWidgetsSequentially = async () => {
      for (let i = 0; i < widgetQueue.length; i++) {
        const widget = widgetQueue[i];
        setLoadedWidgets(prev => [...prev, widget]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between API requests
      }
    };

    if (widgetQueue.length > 0) {
      loadWidgetsSequentially();
    }
  }, [widgetQueue]);

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Teams (First Row on Mobile) */}
        <div className="order-1 md:order-2">
          <h1 className="text-xl font-bold mb-4">Teams</h1>
          {loadedWidgets.includes(TeamsWidget) ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              navigation={true}
              modules={[Navigation]}
              pagination={{ clickable: true }}
              loop={true}
            >
              {favorites.teams.map((team, index) => (
                <SwiperSlide key={index}>
                  <TeamsWidget team={team} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>Loading teams...</p>
          )}
        </div>
  
        {/* Games (Second Row on Mobile) */}
        <div className="order-2 md:order-3">
          <h1 className="text-xl font-bold mb-4">Games</h1>
          {loadedWidgets.includes(GamesWidget) ? (
            <div className="h-full">
              <GamesWidget teams={favorites.teams} leagues={favorites.leagues} />
            </div>
          ) : (
            <p>Loading games...</p>
          )}
        </div>
  
        {/* Standings (Third Row on Mobile) */}
        <div className="order-3 md:order-1 col-span-1 row-span-2">
          <h1 className="text-xl font-bold mb-4">Standings</h1>
          {loadedWidgets.includes(StandingsWidget) ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              navigation={true}
              modules={[Navigation]}
              pagination={{ clickable: true }}
              loop={true}
            >
              {favorites.leagues.map((league, index) => (
                <SwiperSlide key={index}>
                  <StandingsWidget league={league} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>Loading standings...</p>
          )}
        </div>
      </div>
    </div>
  );  

  // return (
  //   <div>
  //     <Header />
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
  //       {/* Standings Section */}
  //       <div className="col-span-1">
  //         <h1 className="text-xl font-bold mb-4">Standings</h1>
  //         {loadedWidgets.includes(StandingsWidget) ? (
  //           <Swiper
  //             spaceBetween={20}
  //             slidesPerView={1}
  //             navigation={true}
  //             modules={[Navigation]}
  //             pagination={{ clickable: true }}
  //             loop={true}
  //           >
  //             {favorites.leagues.map((league, index) => (
  //               <SwiperSlide key={index}>
  //                 <StandingsWidget league={league} />
  //               </SwiperSlide>
  //             ))}
  //           </Swiper>
  //         ) : (
  //           <p>Loading standings...</p>
  //         )}
  //       </div>
  
  //       {/* Games Section */}
  //       <div className="col-span-1">
  //         <h1 className="text-xl font-bold mb-4">Games</h1>
  //         {loadedWidgets.includes(GamesWidget) ? (
  //           <div className="h-full">
  //             <GamesWidget teams={favorites.teams} leagues={favorites.leagues} />
  //           </div>
  //         ) : (
  //           <p>Loading games...</p>
  //         )}
  //       </div>
  
  //       {/* Teams Section */}
  //       <div className="col-span-1">
  //         <h1 className="text-xl font-bold mb-4">Teams</h1>
  //         {loadedWidgets.includes(TeamsWidget) ? (
  //           <Swiper
  //             spaceBetween={20}
  //             slidesPerView={1}
  //             navigation={true}
  //             modules={[Navigation]}
  //             pagination={{ clickable: true }}
  //             loop={true}
  //           >
  //             {favorites.teams.map((team, index) => (
  //               <SwiperSlide key={index}>
  //                 <TeamsWidget team={team} />
  //               </SwiperSlide>
  //             ))}
  //           </Swiper>
  //         ) : (
  //           <p>Loading teams...</p>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
}
//   return (
//     <div>
//       <Header />
//       <h1>Your Favorite Leagues</h1>
//       {loadedWidgets.includes(StandingsWidget) ? (
//         <Swiper
//           spaceBetween={50}
//           slidesPerView={1}
//           navigation={true}
//           modules={[Navigation]}
//           pagination={{ clickable: true }}
//           loop={true}
//         >
//           {favorites.leagues.map((league, index) => (
//             <SwiperSlide key={index}>
//               <StandingsWidget league={league} />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       ) : (
//         <p>Loading leagues...</p>
//       )}
      
//       <h1>Upcoming Games</h1>
//       {loadedWidgets.includes(GamesWidget) ? (
//         <GamesWidget teams={favorites.teams} leagues={favorites.leagues} />
//       ) : (
//         <p>Loading games...</p>
//       )}
      
//       <h1>Your Favorite Teams</h1>
//       {loadedWidgets.includes(TeamsWidget) ? (
//         <TeamsWidget teams={favorites.teams} />
//       ) : (
//         <p>Loading teams...</p>
//       )}
//     </div>
//   );  
// }