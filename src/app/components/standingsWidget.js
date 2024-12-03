import { useEffect, useState } from 'react';


const StandingsWidget = ({ league }) => {
const [standings, setStandings] = useState([]);

useEffect(() => {
    const fetchStandings = async () => {
      if (!league) return;
      console.log("Fetching standings for league:", league);
      try {
        const url = `https://${process.env.NEXT_PUBLIC_API_HOST}/standings?league=${league}&season=2024`;
        console.log(url);
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-host': process.env.NEXT_PUBLIC_API_HOST,
                'x-rapidapi-key': process.env.NEXT_PUBLIC_API_KEY,
            },
        };
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        const leagueStandings = data.response[0]?.league?.standings[0] || [];
        setStandings(leagueStandings);
        console.log("Standings:", leagueStandings);
      } catch (error) {
        console.error("Error fetching standings:", error);
      }
    };

    fetchStandings();
  }, [league]);

  return (
    <table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Team</th>
          <th>Points</th>
          <th>Played</th>
          <th>Won</th>
          <th>Drawn</th>
          <th>Lost</th>
          <th>Goals For</th>
          <th>Goals Against</th>
          <th>Goal Difference</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team) => (
          <tr key={team.team.id}>
            <td>{team.rank}</td>
            <td><img src={team.team.logo} alt={team.team.name} />
            {team.team.name}</td>
            <td>{team.points}</td>
            <td>{team.all.played}</td>
            <td>{team.all.win}</td>
            <td>{team.all.draw}</td>
            <td>{team.all.lose}</td>
            <td>{team.all.goals.for}</td>
            <td>{team.all.goals.against}</td>
            <td>{team.goalsDiff}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StandingsWidget;
