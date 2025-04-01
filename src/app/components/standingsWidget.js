import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchStandings } from '../../footballapi';


const StandingsWidget = ({ league, teamArray }) => {
const [chosenLeague, setChosenLeague] = useState(null);
const [standings, setStandings] = useState([]);
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });
const [defaultStandings, setDefaultStandings] = useState([]);
const [failure, setFailure] = useState(false);
const columnKeyMap = {
  highlight: "",
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

const getSecondNumbers = (teamArray) => {
  if (!Array.isArray(teamArray) || teamArray.length === 0) return [];

  return teamArray.map(item => {
      if (Array.isArray(item)) {
          return parseInt(teamArray); 
      } else if (typeof item === 'object' && item !== null) {
          return parseInt(Object.values(item)[1]); 
      }
      return null;
  }).filter(num => num !== null);
};

const [teamIds, setTeamIds] = useState(getSecondNumbers(teamArray) || []);

useEffect(() => {
  const fetchStandingsData = async () => {

    const data = await fetchStandings(league);
    if (data.length === 0) {
      setFailure(true);
    }
    if (data) {
      setChosenLeague(data);
      setStandings(data.standings[0]);
      setDefaultStandings(data.standings[0]);
    }
  };
  fetchStandingsData();
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
        <p>No standings found</p>
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
      <div className="flex-row justify-center items-center  bg-gray-400 text-center p-4 w-full">
        <img src={chosenLeague?.logo} alt={chosenLeague?.name} className="w-24 h-24 object-contain bg-gray-400 m-auto" />
      </div>
      <table className="table-auto w-full text-sm text-black border-collapse p-2">
      <thead className="bg-gray-400">
        <tr className='border-b-2 border-gray-400'>
          <th className="w-2 p-0"></th>
          {['rank', 'team', 'P', 'M', 'W', 'D', 'L', 'GF', 'GA', 'GD'].map((key) => (
              <th 
                  key={key} 
                  className="p-[0.2rem] cursor-pointer max-w-max text-center" 
                  onClick={() => handleSort(key)}
              >
                  {key.toUpperCase()} {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '▲' : sortConfig.direction === 'desc' ? '▼' : '—') : '—'}
              </th>
          ))}
        </tr>
      </thead>
        <tbody>
          {standings.map((team) => (
            <tr key={team.team.id} className={`even:bg-gray-100 odd:bg-gray-300 ${teamIds.includes(team.team.id) ? 'bg-yellow-300' : ''}`}>
              <td className={`${teamIds.includes(team.team.id) ? 'bg-yellow-200 w-1' : ''}`}></td>
              <td className=" text-center">{team.rank}</td>
              <td key={team.team.id} className=" flex flex-col items-center pt-1">
                  <Link href={`/team/${team.team.id}-${league}`} className="flex flex-col items-center">
                    <img src={team.team.logo} alt={team.team.name} className="w-4 h-4 mb-2 sm:w-8 sm:h-8" />
                    <span className="text-xs">{team.team.name}</span>
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
