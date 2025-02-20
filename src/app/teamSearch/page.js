"use client";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { fetchCountries, fetchLeagues } from '../../footballapi';
import Header from '../components/header';
import TeamsWidget from '../components/teamsWidget';
import TeamSearchWidget from '../components/teamSearchWidget';
import { useRouter } from 'next/navigation';
import Footer from "../components/footer";

export default function Home() {
  const { data: session, status } = useSession();
  const [soccerPulseData, setSoccerPulseData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [showStandings, setShowStandings] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
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
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
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
    setSelectedCountry(countryCode);
    let leaguesData = await fetchLeagues(countryCode);
    setLeagues(leaguesData);
};

const handleLeagueChange = async (e) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
};

const toggleSearchBox = () => {
    const searchBox = document.getElementById('search-box');
    searchBox.classList.toggle('hidden');
    setIsOpen(!isOpen);
};


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
      } catch (error) {
        console.error("Error fetching data:", error);
        setSoccerPulseData([]);
      }
    };

    fetchData();
  }, []);

  const handleAddFavorite = async (teamId) => {
    if (!teamId) {
        alert("Please select a league first.");
        return;
    }

    try {
        const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: session?.user?.email, newItem: { teamId } }),
        });
        const data = await response.json();
        } catch (error) {
          console.error("Error adding favorite:", error);
        }
    }; 


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
      </div>
    </section>
    </div>
      <div className="p-8">
        <TeamSearchWidget league={selectedLeague} />
      </div>
      <Footer />
    </div>
  );
}