"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation';
import Header from '../components/header';
import StandingsWidget from '../components/standingsWidget';
import TeamsWidget from '../components/teamsWidget';
import GamesWidget from '../components/gamesWidget';

export default function AccountHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  // const [favorites, setFavorites] = useState([]);
  // const [currentIndex, setCurrentIndex] = useState(0); // Track current favorite
  const [favorites, setFavorites] = useState({ leagues: [], teams: [] }); // Adjusted state structure
  const [currentIndex, setCurrentIndex] = useState({ leagues: 0, teams: 0 });
  const [isFetched, setIsFetched] = useState(false); // Flag to prevent infinite loop in useEffect


  useEffect(() => {
    const fetchFavorites = async () => {
        if (status === "authenticated" && session?.user?.email && !isFetched) {
          const Eheader = session?.user?.email;
          const response = await fetch('/api/favorites', {
            headers: { 'user-email': Eheader }
          });
          if (!response.ok) {
            // Handle non-JSON error response
            const errorText = await response.text();
            console.error("Error fetching data:", errorText);
            return;
          }
          console.log("made it this far")
          const data = await response.json();
          console.log("Fetched favorites:", data[0]);
          let data1 = data[0].Favorites;

          const favoritesData = data[0].Favorites;

          const leagues = favoritesData[0]?.map(item => item.leagueId) || [];
          const teams = data1[1]?.map((team) => ({
            leagueId: team[0], // League ID
            teamId: team[1],   // Team ID
          })) || [];
          console.log("Leagues:", leagues);
          console.log("Teams:", teams);

    
          setFavorites({
            leagues,
            teams,
          });

          setIsFetched(true);
        }
        if (status === "unauthenticated") {
            console.log("User is not authenticated.");
            router.push('/login');
        }
        else {
            console.log("User authentication status:", status);
        }
    };
    fetchFavorites();
  }, [favorites, status, session, router, isFetched]);

  const handleNextFavorite = () => {
    // Increment currentIndex, looping back to the start if at the end of the array
    const nextIndex = (currentIndex + 1) % favorites.length;
    setCurrentIndex(nextIndex);
  };

  const handlePrevFavorite = () => {
    // Increment currentIndex, looping back to the start if at the end of the array
    const nextIndex = (currentIndex - 1) % favorites.length;
    setCurrentIndex(nextIndex);
  };

  const handleNextTeam = () => {
    setCurrentIndex((prevIndex) => ({
      ...prevIndex,
      teams: (prevIndex.teams + 1) % favorites.teams.length
    }));
  };

  const handlePrevTeam = () => {
    setCurrentIndex((prevIndex) => ({
      ...prevIndex,
      teams: (prevIndex.teams - 1 + favorites.teams.length) % favorites.teams.length
    }));
  };

  return (
    <div>
      <Header />
      <h1>Your Favorite Leagues</h1>
      {favorites.leagues.length > 0 ? (
        favorites.leagues.map((league, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <StandingsWidget league={league} />
          </div>
        ))
      ) : (
        <p>No leagues found</p>
      )}

      <h1>Your Favorite Teams</h1>
      {/* {favorites.teams.length > 0 ? (
        <TeamsWidget teams={favorites.teams} />
      ) : (
        <p>No teams found</p>
      )} */}

      <h1>Upcoming Games</h1>
      {favorites.teams.length > 0 || favorites.leagues.length > 0 ? (
        <GamesWidget teams={favorites.teams} leagues={favorites.leagues} />
      ) : (
        <p>No games found</p>
      )}
    </div>
  );
}