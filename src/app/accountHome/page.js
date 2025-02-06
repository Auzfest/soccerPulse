"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense, lazy } from "react";
import Header from '../components/header';
const StandingsWidget = lazy(() => import('../components/standingsWidget'));
const TeamsWidget = lazy(() => import('../components/teamsWidget'));
const GamesWidget = lazy(() => import('../components/gamesWidget'));
const LoadingScreen = lazy(() => import("../components/loadingScreen"));
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useMediaQuery } from 'react-responsive';
import Link from 'next/link';

export default function AccountHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [isWidgetsLoading, setIsWidgetsLoading] = useState(true);
  const [favorites, setFavorites] = useState({ leagues: [], teams: [] });
  const [widgetQueue, setWidgetQueue] = useState([]);
  const [loadedWidgets, setLoadedWidgets] = useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

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
          setWidgetQueue([StandingsWidget, TeamsWidget, GamesWidget]);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        } finally {
          setLoading(false);
        }
      } else if (status === "unauthenticated") {
        router.push('/login');
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [status, session, router]);

  useEffect(() => {
    const loadWidgetsSequentially = async () => {
      for (let i = 0; i < widgetQueue.length; i++) {
        const widget = widgetQueue[i];
        setLoadedWidgets(prev => [...prev, widget]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    if (widgetQueue.length > 0) {
      loadWidgetsSequentially();
    }
    if (loadedWidgets.length === widgetQueue.length) {
      setTimeout(() => { setIsWidgetsLoading(false); }, 1000);
    }
  }, [widgetQueue]);

  if (loading || isWidgetsLoading || status === "loading") return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <LoadingScreen />
    </div>
    );

  return (
    <div>
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 md:p-6">
        {/* Teams (First Row on Mobile) */}
        <div className="order-1 md:order-2 bg-slate-200 rounded-md text-center w-full m-0 lg:w-full p-8 mt-8 md:mt-0">
          <h1 className="text-xl font-bold mb-4">Teams</h1>
          {favorites.teams.length > 0 ? (
            loadedWidgets.includes(TeamsWidget) ? (
              <Suspense fallback={<p>Loading...</p>}>
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                navigation={true}
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                loop={true}
              >
                {favorites.teams.map((team, index) => (
                  team.leagueId == 0 || team.teamId == 0 ? (
                    <p className="text-gray-500">No favorite teams added yet.<br />Search for a team <Link href="/teamSearch"><span className='underline text-blue-500'>here</span></Link> to add it to your favorites.</p>
                  ) : (   
                    <SwiperSlide key={index}>
                      <TeamsWidget teams={team} />
                    </SwiperSlide>
                  )
                ))}
              </Swiper>
              </Suspense>
            ) : (
              <p>Loading teams...</p>
            ) 
          ) : (
            <p className="text-gray-500">No favorite teams added yet.<br />Search for a team <Link href="/teamSearch"><span className='underline text-blue-500'>here</span></Link> to add it to your favorites.</p>
          )}
        </div>
  
        {/* Games (Second Row on Mobile) */}
        <div className="order-2 md:order-3  bg-slate-200 rounded-md text-center w-full m-0 lg:w-full p-8">
          <h1 className="text-xl font-bold mb-4">Recent and Upcoming Games</h1>
          {favorites.teams.length > 0 ? (
            loadedWidgets.includes(GamesWidget) ? (
              <div className="h-full">
                <GamesWidget teams={favorites.teams} leagues={favorites.leagues} />
              </div>
            ) : (
              <p>Loading games...</p>
            ) 
          ) : (
            <p className="text-gray-500">No favorite teams added yet.<br />Search for a team <Link href="/teamSearch"><span className='underline text-blue-500'>here</span></Link> to add it to your favorites.</p>
          )}
        </div>
  
        {/* Standings (Third Row on Mobile) */}
        <div className="order-3 md:order-1 col-span-1 row-span-3 bg-slate-200 rounded-md text-center w-full m-0 lg:w-full md:p-8">
          <h1 className="text-xl font-bold mb-4">Standings</h1>
          {favorites.leagues.length > 0 ? (
            loadedWidgets.includes(StandingsWidget) ? (
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                navigation={true}
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                loop={true}
              >
                {favorites.leagues.map((league, index) => (
                  <SwiperSlide key={index}>
                    <div className=' px-12 mx-auto rounded-md'>
                      <StandingsWidget league={league} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p>Loading standings...</p>
            ) 
          ) : (
            <p className="text-gray-500">No favorite leagues added yet.<br />Search for a league <Link href="/leagueSearch"><span className='underline text-blue-500'>here</span></Link> to add it to your favorites.</p>
          )}
        </div>
      </div>
    </div>
  );  
};