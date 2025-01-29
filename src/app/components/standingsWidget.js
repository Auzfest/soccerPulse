import { useEffect, useState } from 'react';


const StandingsWidget = ({ league }) => {
const [standings, setStandings] = useState([]);
const [failure, setFailure] = useState(false);

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
        setFailure(true);
      }
    };

    fetchStandings();
  }, [league]);

  if (failure) {
    return (
      <div style={{
        padding: '10px',
        textAlign: 'center',
      }} className="bg-gray-400">
        <p>Error fetching standings</p>
      </div>
    );
  }

  if (standings.length === 0 && !failure) {
    return (
      <div style={{
        padding: '10px',
        textAlign: 'center',
      }} className="bg-gray-400">
        <p>Please search a league</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
    <table className="table-auto w-full text-sm text-black border-collapse p-2">
      <thead className="bg-gray-400">
        <tr className='border-b-2 border-gray-300'>
          <th className=" ">Pos</th>
          <th className="  ">Team</th>
          <th className="p-1">P</th>
          <th className="p-1">W</th>
          <th className="p-1">D</th>
          <th className="p-1">L</th>
          <th className="p-1">GF</th>
          <th className="p-1">GA</th>
          <th className="p-1">GD</th>
          <th className="p-1">Pts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team) => (
          <tr key={team.team.id} className="even:bg-gray-100 odd:bg-gray-300">
            <td className=" text-center">{team.rank}</td>
            <td key={team.team.id} className=" flex flex-col items-center pt-1">
                  <img src={team.team.logo} alt={team.team.name} className="w-10 h-10 mb-2" />
                  <span>{team.team.name}</span>
            </td>
            <td className="p-0 text-center">{team.points}</td>
            <td className="p-0 text-center">{team.all.played}</td>
            <td className="p-0 text-center">{team.all.win}</td>
            <td className="p-0 text-center">{team.all.draw}</td>
            <td className="p-0 text-center">{team.all.lose}</td>
            <td className="p-0 text-center">{team.all.goals.for}</td>
            <td className="p-0 text-center">{team.all.goals.against}</td>
            <td className="p-0 text-center">{team.goalsDiff}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default StandingsWidget;
