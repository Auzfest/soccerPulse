import React from 'react';
import {useState, useEffect} from 'react';
import Link from 'next/link';
import { getSpecificTeam } from '../../footballapi';

export default function TeamWidget({ leagueId, teamId }) {
    const [teamData, setTeamData] = useState(null);
    const [failure, setFailure] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      const fetchTeamData = async () => {
        if (!leagueId || !teamId) {
            console.error('Invalid leagueId or teamId');
            return
        };
  
        try {
          const data = await getSpecificTeam(leagueId, teamId);
          setTeamData(data);
          setTimeout(() => setIsLoaded(true), 300);
        } catch (error) {
          console.error('Error fetching team data:', error);
          setFailure(true);
        }
      };
  
      fetchTeamData();
    }, [leagueId, teamId]);
  
    if (leagueId == 0 || teamId == 0) return (
      <div className="animate-pulse bg-gray-300 w-full h-32 rounded-md p-8 flex justify-center items-center transition ease-in-out duration-500">
            <p className="text-gray-500">No favorite teams added yet.<br />Search for a team <Link href="/teamSearch"><span className='underline text-blue-500'>here</span></Link> to add it to your favorites.</p>
      </div>
    );


    if (!teamData) return (
      <div className="animate-pulse bg-gray-300 w-full h-32 rounded-md p-8 flex justify-center items-center transition ease-in-out duration-500">
        <p className="text-gray-500">Loading team data...</p>
      </div>
    );
    if (failure) {
        return (
          <div style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            margin: '10px',
            textAlign: 'center',
          }}>
            <p>Teams are unavailable at the moment. Please try again later.</p>
          </div>
        );
      }
    return (
      <div className={`border border-gray-300 rounded-lg p-6 mx-4 my-6 flex flex-col items-center transition ease-in-out duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <img
        src={teamData.team.logo}
        alt={teamData.team.name}
        className="w-32 h-32 object-contain mb-4"
      />
      <h3 className="text-xl font-bold text-gray-800">{teamData.team.name}</h3>
      <p className="text-lg text-gray-600">{teamData.league.name}</p>
      <div className="w-full mb-6 mt-4">
    <p className="font-semibold text-center">Games Played: {teamData.fixtures.played.total}</p>
    <div className="w-full bg-gray-300 h-4 rounded">
      <div className="w-full bg-gray-300 h-4 rounded flex">
        <div
            className="bg-blue-500 h-4 rounded-l"
            style={{ width: `${(teamData.fixtures.played.home / teamData.fixtures.played.total) * 100}%` }}
        ></div>
        <div
            className="bg-red-500 h-4 rounded-r"
            style={{ width: `${(teamData.fixtures.played.away / teamData.fixtures.played.total) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-700 mt-1">
            <span className="text-blue-600">Home: {teamData.fixtures.played.home}</span>
            <span className="text-red-600">Away: {teamData.fixtures.played.away}</span>
      </div>
    </div>
  </div>

  <div className="w-full mb-6">
    <p className="font-semibold text-center">Match Results</p>
    <div className="w-full bg-gray-300 h-4 rounded flex">
      <div
        className="bg-green-500 h-4 rounded-l"
        style={{ width: `${(teamData.fixtures.wins.total / teamData.fixtures.played.total) * 100}%` }}
      ></div>
      <div
        className="bg-gray-500 h-4"
        style={{ width: `${(teamData.fixtures.draws.total / teamData.fixtures.played.total) * 100}%` }}
      ></div>
      <div
        className="bg-red-500 h-4 rounded-r"
        style={{ width: `${(teamData.fixtures.loses.total / teamData.fixtures.played.total) * 100}%` }}
      ></div>
    </div>
    <div className="flex justify-between text-sm text-gray-700 mt-1">
      <span className="text-green-600">Wins: {teamData.fixtures.wins.total}</span>
      <span className="text-gray-600">Draws: {teamData.fixtures.draws.total}</span>
      <span className="text-red-600">Losses: {teamData.fixtures.loses.total}</span>
    </div>
  </div>
  <div className="w-full mb-6">
    <p className="font-semibold text-center">Goals Scored vs Conceded</p>
    <div className="w-full bg-gray-300 h-4 rounded flex">
      <div
        className="bg-green-400 h-4 rounded-l"
        style={{ width: `${(teamData.goals.for.total.total / (teamData.goals.for.total.total + teamData.goals.against.total.total)) * 100}%` }}
      ></div>
      <div
        className="bg-red-400 h-4 rounded-r"
        style={{ width: `${(teamData.goals.against.total.total / (teamData.goals.for.total.total + teamData.goals.against.total.total)) * 100}%` }}
      ></div>
    </div>
    <div className="flex justify-between text-sm text-gray-700 mt-1">
      <span className="text-green-600">Goals For: {teamData.goals.for.total.total}</span>
      <span className="text-red-600">Goals Against: {teamData.goals.against.total.total}</span>
    </div>
  </div>
  <div className=" text-center">
    <p className="text-xl font-bold">
      Goal Difference: 
      <span className={(teamData.goals.for.total.total/teamData.goals.against.total.total).toFixed(2) >= 0 ? "text-green-600" : "text-red-600"}>
        {" "}{(teamData.goals.for.total.total/teamData.goals.against.total.total).toFixed(2)}
      </span>
    </p>
  </div>
      <a
        href={`/team/${teamData.team.id}-${teamData.league.id}`}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ease-in-out duration-300"
      >
        View More
      </a>
    </div>
    );
}
