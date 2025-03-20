"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { fetchCountries, fetchLeagues } from '../../footballapi';
import Footer from '../components/footer';
import Header from '../components/header';
import LoadingScreen from "../components/loadingScreen";
import StandingsWidget from '../components/standingsWidget';

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isFavoriteButtonDisabled, setIsFavoriteButtonDisabled] = useState(false);
  const [soccerPulseData, setSoccerPulseData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [showStandings, setShowStandings] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');

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
    setSelectedCountry(countryCode);
    let leaguesData = await fetchLeagues(countryCode);
    setLeagues(leaguesData);
};

const handleLeagueChange = async (e) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    setIsFavorite(false);
    setIsFavoriteButtonDisabled(false);
    if (status === "authenticated") {
        await getFavorites();
    }
};

const getFavorites = async () => {
    const response = await fetch('/api/favorites', {
        method: 'GET',
        headers: {
            'user-email': session?.user?.email,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch favorites");
    }

    const data = await response.json();
    setFavorites(data[0].Favorites[0]); 
  };

  const isLeagueFavorite = (league) => {
    for (const favorite of favorites) {
      if (favorite == league) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (selectedLeague && favorites.length > 0) {
        setIsFavorite(isLeagueFavorite(selectedLeague));
    }
  }, [selectedLeague, favorites]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Soccer_Pulse`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const parsedData = Array.isArray(data) ? data : data.Items || [];
        setSoccerPulseData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSoccerPulseData([]);
      }
    };

    fetchData();
  }, []);

  const handleAddFavorite = async (leagueId) => {
    if (!leagueId) {
        alert("Please select a league first.");
        return;
    }
    try {
        const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: session?.user?.email, newItem: { leagueId } }),
        });
        setIsFavoriteButtonDisabled(true);
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    }; 

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <LoadingScreen />
        </div>
      );
    }

  return (
    <div>
    <Header />
    <div id="searchSection" className="bg-slate-200 shadow-lg rounded-lg p-6 max-w-lg mx-auto my-6">
    <section className="text-center">
      <h3 className="text-2xl font-bold text-gray-800">Select a Country and League</h3>

      <div id="search-box" className="mt-4">
        {countries.length > 0 && (
          <div className="mb-4">
            <label htmlFor="countries" className="block text-gray-700 font-semibold">Select Country *</label>
            <select 
              id="countries" 
              onChange={handleCountryChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 text-gray-900"
            >
              <option value="" className="text-gray-500">--Select Country--</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code} className="text-gray-900">
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {countries.length > 0 && (
          <div className="mb-4">
            <label htmlFor="leagues" className="block text-gray-700 font-semibold">Select League *</label>
            <select 
              id="leagues" 
              onChange={handleLeagueChange} 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 text-gray-900"
            >
              <option value="39" className="text-gray-500">--Select League--</option>
              {leagues.map((league) => (
                <option key={league.league.id} value={league.league.id} className="text-gray-900">
                  {league.league.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {status === "authenticated" && !isFavorite && !isFavoriteButtonDisabled ? (
          <button
            onClick={() => handleAddFavorite(selectedLeague)}
            disabled={!selectedLeague}
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 transition"
          >
            Add as Favorite
          </button>
        ) : (
          <p>This league is already a favorite</p>
        )}
      </div>
    </section>
  </div>
  <div className="p-16 max-w-4xl lg:mx-auto mb-60">
    <StandingsWidget league={selectedLeague} />
  </div>
  <Footer />
</div>
  );
}