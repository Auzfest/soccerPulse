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

  if ( standings.length === 0) {
    return (
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px',
        textAlign: 'center',
      }}>
        <p>Standings are unavailable at the moment. Please try again later.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
    <table className="table-auto w-full text-sm text-black border-collapse ">
      <thead className="bg-gray-400">
        <tr>
          <th className="  p-2">Pos</th>
          <th className="  p-2">Team</th>
          <th className="  p-2">P</th>
          <th className="  p-2">W</th>
          <th className="  p-2">D</th>
          <th className="  p-2">L</th>
          <th className="  p-2">GF</th>
          <th className="  p-2">GA</th>
          <th className="  p-2">GD</th>
          <th className="  p-2">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team) => (
          <tr key={team.team.id} className="even:bg-gray-100 odd:bg-gray-300">
            <td className="  p-2 text-center">{team.rank}</td>
            <td className="  p-2 flex items-center">
              <img src={team.team.logo} alt={team.team.name} className="w-5 h-5 mr-2" />
              {team.team.name}
            </td>
            <td className="  p-2 text-center">{team.all.played}</td>
            <td className="  p-2 text-center">{team.all.win}</td>
            <td className="  p-2 text-center">{team.all.draw}</td>
            <td className="  p-2 text-center">{team.all.lose}</td>
            <td className="  p-2 text-center">{team.all.goals.for}</td>
            <td className="  p-2 text-center">{team.all.goals.against}</td>
            <td className="  p-2 text-center">{team.goalsDiff}</td>
            <td className="  p-2 text-center">{team.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default StandingsWidget;
