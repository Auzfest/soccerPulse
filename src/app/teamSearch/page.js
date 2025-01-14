"use client";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { fetchCountries, fetchLeagues, getTeams, getSpecificTeam, toggleSearchBox } from '../../footballapi';
import Header from '../components/header';
import TeamSearchWidget from '../components/teamSearchWidget';
import GamesWidget from "../components/gamesWidget";

import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const [soccerPulseData, setSoccerPulseData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [showStandings, setShowStandings] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');

  const router = useRouter();
  const [favorites, setFavorites] = useState({ leagues: [], teams: [] });

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
          // setWidgetQueue([StandingsWidget, TeamsWidget, GamesWidget]);
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
    const fetchCountriesData = async () => {
        try {
            const countriesData = await fetchCountries();
            if (countriesData) {
                setCountries(countriesData);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };
    fetchCountriesData();
  }, []);

  const handleCountryChange = async (e) => {
    const countryCode = e.target.value;
    console.log("Selected Country:", countryCode);
    setSelectedCountry(countryCode);
    let leaguesData = await fetchLeagues(countryCode);
    console.log("Selected Leagues:", leaguesData);
    setLeagues(leaguesData);
};

useEffect(() => {
    if (leagues.length > 0) {
        console.log("Updated Leagues:", leagues);
    }
}, [leagues]);

const handleLeagueChange = async (e) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    console.log("Select League:", leagueId);
};

const toggleSearchBox = () => {
    const searchBox = document.getElementById('search-box');
    searchBox.classList.toggle('hidden');
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Soccer_Pulse`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched Data:", data); // Log the data to see its structure

        // Check if data is in the expected format
        const parsedData = Array.isArray(data) ? data : data.Items || [];
        setSoccerPulseData(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSoccerPulseData([]); // Handle the error case
      }
    };

    fetchData();
  }, []);

  const handleAddFavorite = async (teamId) => {
    if (!teamId) {
        alert("Please select a league first.");
        return;
    }
    console.log("User authentication status:", status);
    console.log("User session:", session);

    try {
        const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: session?.user?.email, newItem: { teamId } }),
        });
        const data = await response.json();
        console.log("Response from backend:", data);
        } catch (error) {
        console.error("Error adding favorite:", error);
        alert("Failed to add the team to favorites.");
        }
    }; 


  return (
    <div>
        <Header />
    <div id="searchSection">
        <section className="search">
            <h3>Search for a league</h3>
            <p>Click the arrow below to search for a specific league.</p>
            <div id="search-box" className="hidden">
            {countries.length > 0 && (
            <div>
                <label htmlFor="countries">Select Country</label><br />
                <select id="countries" onChange={handleCountryChange} className="text-black">
                    <option value="" className="text-black">--Select Country--</option>
                    {countries.map((country) => (
                        <option key={country.code} value={country.code} className="text-black">{country.name}</option>
                    ))}
                </select><br />
            </div>
            )}
            {countries.length > 0 && (
            <div>
                <label htmlFor="leagues">Select League</label><br />
                <select id="leagues" onChange={handleLeagueChange} className='text-black'>
                    <option value="39" className='text-black'>--Select League--</option>
                    {leagues.map((league) => (
                        <option key={league.league.id} value={league.league.id} className='text-black'>{league.league.name}</option>
                    ))}
                </select><br />
                
            </div>
            )}
            </div>
        </section>
        <div id="toggle-button" onClick={toggleSearchBox}>▲</div>
    </div>
    <TeamSearchWidget league={selectedLeague} />
    <h1>Upcoming Games</h1>
        {favorites.teams.length > 0 || favorites.leagues.length > 0 && currentWidgetIndex > 2 ? (
            <GamesWidget teams={favorites.teams} leagues={favorites.leagues} />
        ) : (
            <p>No games found</p>
        )}
</div>
  );
}