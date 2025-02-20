import Link from 'next/link';
import { useEffect, useState } from 'react';


const StandingsWidget = ({ league }) => {
const [chosenLeague, setChosenLeague] = useState(null);
const [standings, setStandings] = useState([]);
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
const [defaultStandings, setDefaultStandings] = useState([]);
const [failure, setFailure] = useState(false);

const columnKeyMap = {
  rank: "rank",
  team: "team.name",
  P: "points",
  M: "all.played",
  W: "all.win",
  D: "all.draw",
  L: "all.lose",
  GF: "all.goals.for",
  GA: "all.goals.against",
  GD: "goalDifference",
};

useEffect(() => {
    const fetchStandings = async () => {
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
        setChosenLeague(data.response[0]?.league);
        console.log(data.response[0]);
        const leagueStandings = data.response[0]?.league?.standings[0] || [];
        setStandings(leagueStandings);
        setDefaultStandings(leagueStandings);
      } catch (error) {
        console.error("Error fetching standings:", error);
        setFailure(true);
      }
    };

    fetchStandings();
  }, [league]);

  const handleSort = (key) => {
    const mappedKey = columnKeyMap[key];
    if (!mappedKey) return;
  
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "default";
    }
  
    setSortConfig({ key, direction });
  
    if (direction === "default") {
      setStandings(defaultStandings);
    } else {
      const sortedStandings = [...standings].sort((a, b) => {
        const aValue = mappedKey.includes(".")
          ? mappedKey.split(".").reduce((obj, keyPart) => obj?.[keyPart], a)
          : a[mappedKey];
  
        const bValue = mappedKey.includes(".")
          ? mappedKey.split(".").reduce((obj, keyPart) => obj?.[keyPart], b)
          : b[mappedKey];
  
        if (typeof aValue === "string") {
          return direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      });
  
      setStandings(sortedStandings);
    }
  };


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
    <div className='mx-auto border-2 border-gray-400 rounded-md transition ease-in-out duration-500'>
      <div className="overflow-x-auto">
      <div className="flex justify-center items-center  bg-gray-400 text-center p-4">
        <img src={chosenLeague?.logo} alt={chosenLeague?.name} className="w-24 h-24 object-contain bg-gray-400" />
      </div>
      <table className="table-auto w-full text-sm text-black border-collapse p-2">
        <thead className="bg-gray-400">
            <tr className='border-b-2 border-gray-400'>
            {['rank', 'team', 'P', 'M', 'W', 'D', 'L', 'GF', 'GA', 'GD'].map((key) => (
              <th 
                key={key} 
                className="p-1 cursor-pointer max-w-max" 
                onClick={() => handleSort(key)}
              >
                {key.toUpperCase()} {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : sortConfig.direction === 'default' ? '—' : '') : '—'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr key={team.team.id} className="even:bg-gray-100 odd:bg-gray-300">
              <td className=" text-center">{team.rank}</td>
              <td key={team.team.id} className=" flex flex-col items-center pt-1">
                  <Link href={`/team/${team.team.id}-${league}`} className="flex flex-col items-center">
                    <img src={team.team.logo} alt={team.team.name} className="w-8 h-8 mb-2" />
                    <span>{team.team.name}</span>
                  </Link>
              </td>
              <td className="p-0 text-center">{team.points}</td>
              <td className="p-0 text-center">{team.all.played}</td>
              <td className="p-0 text-center">{team.all.win}</td>
              <td className="p-0 text-center">{team.all.draw}</td>
              <td className="p-0 text-center">{team.all.lose}</td>
              <td className="p-0 text-center">{team.all.goals.for}</td>
              <td className="p-0 text-center">{team.all.goals.against}</td>
              <td className="p-0 text-center">{team.all.goals.for - team.all.goals.against}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default StandingsWidget;
