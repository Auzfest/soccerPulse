

// Function to toggle the visibility of the search box
export const toggleSearchBox = () => {
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.classList.toggle('hidden');
    }
};

// Fetch current season based on league ID
export const getCurrentSeason = async (leagueId) => {
    const response = await fetch(`https://${process.env.NEXT_PUBLIC_API_HOST}/v3/leagues?id=${leagueId}`, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': process.env.NEXT_PUBLIC_API_HOST,
            'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
        },
    });
    const data = await response.json();
    const currentSeason = data.response[0].seasons.find(season => season.current).year - 1;
    return currentSeason;
};

// Update the standings season based on the selected league
export const updateStandingsSeason = async (leagueId) => {
    const currentSeason = await getCurrentSeason(leagueId);
    const standings = document.getElementById('wg-api-football-standings');
    const fixtures = document.getElementById('wg-api-football-fixtures');

    if (standings) {
        standings.setAttribute('data-season', currentSeason);
    } else if (fixtures) {
        const currentDate = getCurrentDate();
        fixtures.setAttribute('data-season', currentSeason);
    } else {
        return currentSeason;
    }

    window.document.dispatchEvent(new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true,
    }));
};

// Get the current date in YYYY-MM-DD format
export const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Fetch countries from the API
export const fetchCountries = async () => {
    const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/countries`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': process.env.NEXT_PUBLIC_API_HOST,
            'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
        },
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.response; // Return the countries data
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
};

// Fetch leagues based on the selected country
export const fetchLeagues = async (countryCode) => {
    const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/leagues?code=${countryCode}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': process.env.NEXT_PUBLIC_API_HOST,
            'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
        },
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.response; // Return the leagues data
    } catch (error) {
        console.error('Error fetching leagues:', error);
    }
};

export const fetchStandings = async (league) => {
    if (!league) return;
    try {
      const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/standings?league=${league}&season=2024`;
      const options = {
          method: 'GET',
          headers: {
              'x-rapidapi-host': process.env.NEXT_PUBLIC_API_HOST,
              'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
          },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      const leagueStandings = data.response[0]?.league || [];
      console.log(leagueStandings);
      return leagueStandings;
    } catch (error) {
      console.error("Error fetching standings:", error);
      return [];
    }
  };

// Fetch teams based on the selected league
export const getTeams = async (leagueId) => {
    const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/teams?league=${leagueId}&season=2024`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': process.env.NEXT_PUBLIC_API_HOST,
            'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
        },
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.response; // Return the teams data
    } catch (error) {
        console.error('Error fetching teams:', error);
    }
};

// Fetch specific team statistics
export const getSpecificTeam = async (leagueId, teamId) => {
    const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/teams/statistics?season=2024&team=${teamId}&league=${leagueId}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': process.env.NEXT_PUBLIC_API_HOST,
            'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
        },
    };
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.response; // Return the team statistics data
    } catch (error) {
        console.error('Error fetching specific team:', error);
    }
};

export const getFixtures = async ({ leagueId, teamId, from, to, timezone }) => {
    const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/fixtures?league=${leagueId}&season=2024&team=${teamId}&from=${from}&to=${to}&timezone=${timezone}`;
  
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-host": process.env.NEXT_PUBLIC_API_HOST,
        "x-rapidapi-key": process.env.NEXT_PUBLIC_API_KEY,
      },
    };
  
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        console.error("Error fetching fixtures:", response.status, response.statusText);
        return [];
      }
  
      const data = await response.json();
      return data.response || []; // Return the response array
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      return [];
    }
  };
  
  export const getTeam = async({teamId}) => {
    console.log(teamId);
    const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/players/squads?team=${teamId}`;
    const options = {
        method: 'GET',
        headers: {
            "x-rapidapi-host": process.env.NEXT_PUBLIC_API_HOST,
            "x-rapidapi-key": process.env.NEXT_PUBLIC_API_KEY,
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch players: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        return data.response[0]?.players || [];
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
}
